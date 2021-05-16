/* eslint-disable no-console */

// TODO this file should be unit-tested

import path from 'path';

import {
  writeFile,
  unlink,
  readFile,
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
  ProjectScrapeResult,
} from './scraper/scraper';

export interface CreateProjectParams {
  startURL: string;
  projectName: string;
}

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

export const listProjects = async () => {
  const projectsMap = await createMapObjectFromJSONFilePath(projectsFilePath);
  return projectsMap.values();
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

export const storeResults = (projectId: number, result: ProjectScrapeResult) => {
  const time = Date.now();
  const internalResponsesPath = path.join(dbRootPath, `#${projectId}-${time}-internalResponses.json`);
  const externalResponsesPath = path.join(dbRootPath, `#${projectId}-${time}-externalResponses.json`);
  return Promise.all([
    writeFile(internalResponsesPath, JSON.stringify(result.internalResponses, null, 2)),
    writeFile(externalResponsesPath, JSON.stringify(result.externalResponses, null, 2)),
  ]);
};
