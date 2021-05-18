/* eslint-disable no-console */

// TODO this file should be unit-tested

import path from 'path';

import {
  writeFile,
  unlink,
  readFile,
  readdir,
} from 'fs/promises';

// for watching files, see:
// https://github.com/paulmillr/chokidar
import chokidar from 'chokidar';

import {
  statOrUndefined,
  GenericMap,
  createMapObjectFromJSONFilePath,
  writeJSONFileFromMapObject,
} from './util/fs';

import {
  ScrapingProgress,
} from './scraper/scraper';

import {
  URLScrapingResult,
} from './scraper/scrapeURL';

export interface CreateProjectParams {
  startURL: string;
  projectName: string;
}

export type ProjectMetaData = {
  id: number;
  projectName: string;
  startURL: string;
  createdAt: number;
};

export type ProblematicURLsReportLine = {
  foundOnPage: string;
  referer: string;
  problematicURL: string;
  status: number;
  isValid: boolean;
  message: string;
};

export type ProblematicURLsReport = ProblematicURLsReportLine[];

type RunWithLockedFileFunction = (lockedFilePath?: string) => any;

export const isSafeKeyForObjectMap = (keyName: string) => {
  const forbiddenKeys = Object.getOwnPropertyNames(Object.prototype);
  return !forbiddenKeys.includes(keyName);
};

const dbRootPath = path.resolve(__dirname, '..', 'local-database');

const projectsFilePath = path.join(dbRootPath, 'projects.json');
const maxUIDFilePath = path.join(dbRootPath, 'maxUID.json');

const lockAndUse = (fileToUsePath: string) =>
  async (fnToRun: RunWithLockedFileFunction) => {
    const lockFilePath = `${fileToUsePath}.lock`;
    const lockFileData = `locked by process "${process.pid}" on "${(new Date()).toISOString()}"`;

    try {
      // write to the lock file,
      // failing if it exists already.
      await writeFile(lockFilePath, lockFileData, {
        flag: 'wx',
      });

      try {
        const result = await fnToRun(fileToUsePath);
        return result;
      } catch (err) {
        console.error(`Error while using locked file "${fileToUsePath}"`, err);
      } finally {
        await unlink(lockFilePath);
      }
    } catch (err) {
      console.error(err);
      // TODO check that this code is reliable across different
      // platforms: e.g. Mac OS, Windows.
      if (err.code === 'EEXIST') {
        // the lock file already exists,
        // let's watch the lockfile and try again later!

        // TODO check if this can get us into infinite loops
        // and handle the case
        return new Promise((resolve, reject) => {
          const watcher = chokidar.watch(lockFilePath);

          watcher.on('unlink', () => {
            try {
              const res = lockAndUse(fileToUsePath)(fnToRun);
              resolve(res);
            } catch (newTryErr) {
              reject(newTryErr);
            }
          });
        });
      }
      throw err;
    }

    return true;
  };

const getUID = () => lockAndUse(maxUIDFilePath)(
  async (dbPath): Promise<number> => {
    try {
      const contents = await readFile(dbPath);
      const maxId = parseFloat(contents.toString());
      const newMaxId = maxId + 1;
      await writeFile(dbPath, `${newMaxId}`);
      return newMaxId;
    } catch (err) {
      const maxId = 1;
      await writeFile(dbPath, `${maxId}`);
      return maxId;
    }
  },
);

const createProjectInMemory = (params: CreateProjectParams, id: number) =>
  (storage: GenericMap) => {
    const { projectName } = params;

    if (!isSafeKeyForObjectMap(projectName)) {
      return `Error: the name "${projectName}" cannot be used by storage engine.`;
    }

    if (storage.has(projectName)) {
      return `Error: project already exists. Project name: "${projectName}".`;
    }

    const projectMetaData = {
      id,
      projectName,
      startURL: params.startURL,
      createdAt: Date.now(),
    };

    storage.set(projectName, projectMetaData);

    return projectMetaData;
  };

const obtainProjectsStore = async () => {
  const stat = await statOrUndefined(projectsFilePath);
  if (stat === undefined) {
    return new Map<string, any>();
  }
  return createMapObjectFromJSONFilePath(projectsFilePath);
};

export const createProject = async (params: CreateProjectParams) =>
  lockAndUse(projectsFilePath)(async () => {
    const store: GenericMap = await obtainProjectsStore();
    const id = await getUID();
    const projectMetaData = createProjectInMemory(params, id)(store);
    await writeJSONFileFromMapObject(projectsFilePath)(store);
    return projectMetaData;
  });

export const listProjects = async (): Promise<ProjectMetaData[]> => {
  const projectsMap = await createMapObjectFromJSONFilePath(projectsFilePath);
  return [...projectsMap.values()];
};

export const findProjectById = async (id: number): Promise<ProjectMetaData> => {
  const projects = await listProjects();
  return projects.find((project) => project.id === id);
};

export const deleteProject = async (projectId: number) =>
  lockAndUse(projectsFilePath)(async () => {
    const store: GenericMap = await obtainProjectsStore();
    for (const [key, value] of store.entries()) {
      if (value.id === projectId) {
        store.delete(key);
      }
    }
    await writeJSONFileFromMapObject(projectsFilePath)(store);

    return true;
  });

const generateURLReport = (progress: ScrapingProgress) =>
  progress.results.map((result: URLScrapingResult) => ({
    url: result.url,
    status: result.status,
  }));

const generateProblematicURLsReport = (progress: ScrapingProgress): ProblematicURLsReport =>
  [].concat(
    ...progress.results.map(
      (result) =>
        [].concat(
          ...result.problematicURLs.map(
            (oops) => ({
              foundOnPage: result.url,
              referer: oops.referer,
              problematicURL: oops.url,
              status: oops.status,
              isValid: oops.isValid,
              message: oops.message,
            }),
          ),
        ),
    ),
  );

export const storeResults = async (projectId: number, progress: ScrapingProgress) => {
  const project = await findProjectById(projectId);
  const { projectName } = project;
  const date = new Date();
  const humanDate = date.toLocaleString();
  const time = date.getTime();

  const internalURLsFileName = `${projectId}-${time}-internalURLs[${projectName} @ ${humanDate}].json`.replace(/\//g, '.');
  const internalURLsPath = path.join(dbRootPath, internalURLsFileName);

  const problematicURLsFileName = `${projectId}-${time}-problematicURLs[${projectName} @ ${humanDate}].json`.replace(/\//g, '.');
  const problematicURLsFilePath = path.join(dbRootPath, problematicURLsFileName);

  return Promise.all([
    writeFile(
      internalURLsPath,
      JSON.stringify(generateURLReport(progress), null, 2),
    ),
    writeFile(
      problematicURLsFilePath,
      JSON.stringify(generateProblematicURLsReport(progress), null, 2),
    ),
  ]);
};

export const loadReports = async (projectId: number) => {
  const dirEntries = await readdir(dbRootPath);

  const filterExp = new RegExp(`^${projectId}-`);

  const reportFiles = dirEntries
    .filter((entry) => filterExp.test(entry));

  const reports = [];

  reportFiles.forEach((file) => {
    const info = file.match(/^\d+-(\d+)-(\w+)\[/);
    if (info) {
      const time = parseFloat(info[1]);
      const type = info[2];

      reports.push({
        reportType: type,
        date: new Date(time).toLocaleString(),
        time,
        fileName: file,
      });
    }
  });

  reports.sort((a, b) => {
    if (a.reportType !== b.reportType) {
      return (a.reportType > b.reportType) ? 1 : -1;
    }
    return a.time - b.time;
  });

  return reports;
};

export const loadReport = async (reportId: string) => {
  const dirEntries = await readdir(dbRootPath);
  const findExp = new RegExp(`^${reportId}`);
  const reportEntry = dirEntries.find((entry) => findExp.test(entry));

  if (!reportEntry) {
    throw new Error(`Could not find report with id "${reportId}".`);
  }

  const reportDataString = await readFile(path.join(dbRootPath, reportEntry));
  const reportData = JSON.parse(reportDataString.toString());
  return reportData;
};
