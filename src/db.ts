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

export interface CreateProjectParams {
  startURL: string;
  projectName: string;
}

export type ErrorMessage = string;

export type MaybeError = true | ErrorMessage

type RunWithLockedFileFunction = (lockedFilePath?: string) => MaybeError | Promise<MaybeError>;

export const isSafeKeyForObjectMap = (keyName: string) => {
  const forbiddenKeys = Object.getOwnPropertyNames(Object.prototype);
  return !forbiddenKeys.includes(keyName);
};

const dbRootPath = path.resolve(__dirname, '..', 'local-database');

const projectsFilePath = path.join(dbRootPath, 'projects.json');

const lockAndUse = (fileToUsePath: string) =>
  async (fnToRun: RunWithLockedFileFunction): Promise<MaybeError> => {
    const lockFilePath = `${fileToUsePath}.lock`;
    const lockFileData = `locked by process "${process.pid}" on "${(new Date()).toISOString()}"`;

    let fnResult: MaybeError = "Err: Something bad happened at the storage level. I don't know what.";

    try {
      // write to the file,
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
        // the lockfile already exist,
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

const createProjectInMemory = (params: CreateProjectParams) =>
  (storage: GenericMap): MaybeError => {
    const { projectName } = params;

    if (!isSafeKeyForObjectMap(projectName)) {
      return `Error: the name "${projectName}" cannot be used by storage engine.`;
    }

    if (storage.has(projectName)) {
      return `Error: project already exists. Project name: "${projectName}".`;
    }

    const projectMetaData = {
      projectName,
      startURL: params.startURL,
    };

    storage.set(projectName, projectMetaData);

    return true;
  };

export const createProject = async (params: CreateProjectParams): Promise<MaybeError> =>
  lockAndUse(projectsFilePath)(async (dbPath): Promise<MaybeError> => {
    const obtainStore = async () => {
      const stat = await statOrUndefined(dbPath);
      if (stat === undefined) {
        return new Map<string, any>();
      }
      return createMapObjectFromJSONFilePath(dbPath);
    };

    const store: GenericMap = await obtainStore();
    const created = createProjectInMemory(params)(store);

    if (created === true) {
      await writeJSONFileFromMapObject(dbPath)(store);
    }

    return created;
  });
