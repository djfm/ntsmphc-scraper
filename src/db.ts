/* eslint-disable no-console */

// TODO this file should be unit-tested lol

import path from 'path';

import {
  writeFile,
  unlink,
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
import { readFile } from 'fs/promises';

export interface CreateProjectParams {
  startURL: string;
  projectName: string;
}

export type ErrorMessage = string;

export type MaybeError = true | ErrorMessage | object | number

export const isError = (dunnoWhat: MaybeError): dunnoWhat is ErrorMessage => {
  if (typeof dunnoWhat === 'string') {
    return true;
  }

  return false;
};

type RunWithLockedFileFunction = (lockedFilePath?: string) => MaybeError | Promise<MaybeError>;

export const isSafeKeyForObjectMap = (keyName: string) => {
  const forbiddenKeys = Object.getOwnPropertyNames(Object.prototype);
  return !forbiddenKeys.includes(keyName);
};

const dbRootPath = path.resolve(__dirname, '..', 'local-database');

const projectsFilePath = path.join(dbRootPath, 'projects.json');
const maxUIDFilePath = path.join(dbRootPath, 'maxUID.json');

const lockAndUse = (fileToUsePath: string) =>
  async (fnToRun: RunWithLockedFileFunction): Promise<MaybeError> => {
    const lockFilePath = `${fileToUsePath}.lock`;
    const lockFileData = `locked by process "${process.pid}" on "${(new Date()).toISOString()}"`;

    let fnResult: MaybeError = "Err: Something bad happened at the storage level. I don't know what.";

    try {
      // write to the lock file,
      // failing if it exists already.
      await writeFile(lockFilePath, lockFileData, {
        flag: 'wx',
      });

      try {
        fnResult = await fnToRun(fileToUsePath);
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
        return new Promise<MaybeError>((resolve, reject) => {
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

    return fnResult;
  };

const getUID = () => lockAndUse(maxUIDFilePath)(async (dbPath: string): Promise <MaybeError> => {
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
});

const createProjectInMemory = (params: CreateProjectParams, id: number) =>
  (storage: GenericMap): MaybeError => {
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

export const createProject = async (params: CreateProjectParams): Promise<MaybeError> =>
  lockAndUse(projectsFilePath)(async (): Promise<MaybeError> => {
    const store: GenericMap = await obtainProjectsStore();
    const id = await getUID();

    if (isError(id)) {
      throw new Error('Error: unable to get UID.');
    }

    if (typeof id !== 'number') {
      throw new Error('Error: unexpected uid type.');
    }

    const created = createProjectInMemory(params, id)(store);

    if (!isError(created)) {
      await writeJSONFileFromMapObject(projectsFilePath)(store);
    }

    return created;
  });

export const listProjects = async () => {
  const projectsMap = await createMapObjectFromJSONFilePath(projectsFilePath);
  return projectsMap.values();
};

export const deleteProject = async (projectId: number): Promise<MaybeError> =>
  lockAndUse(projectsFilePath)(async (): Promise<MaybeError> => {
    const store: GenericMap = await obtainProjectsStore();
    for (const [key, value] of store.entries()) {
      if (value.id === projectId) {
        store.delete(key);
      }
    }
    await writeJSONFileFromMapObject(projectsFilePath)(store);

    return true;
  });
