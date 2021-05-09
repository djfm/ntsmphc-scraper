import { Stats } from 'fs';
import {
  stat,
  readdir,
  readFile,
} from 'fs/promises';

export const statOrUndefined = async (path: string): Promise<Stats> => {
  try {
    const statObj = await stat(path);
    return statObj;
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
    return undefined;
  }
};

/**
 * Checks whether the provided dirPath points to an existing directory.
 * Returns false if the file does not exist, and doesn't throw under
 * expected conditions.
 */
export const isDirectory = async (dirPath: string): Promise<boolean> => {
  const maybeStat = await statOrUndefined(dirPath);
  if (maybeStat === undefined) {
    return false;
  }
  return maybeStat.isDirectory();
};

export const isEmptyDirectory = async (dirPath: string): Promise<boolean> => {
  const entries = await readdir(dirPath);
  return entries.length === 0;
};

type GenericMap = Map<string, any>;

export const createMapObjectFromJSONFilePath =
  async (filePath: string): Promise<GenericMap> => {
    const fileData = await readFile(filePath);
    const dataString = fileData.toString();
    const dataObj = JSON.parse(dataString);
    return new Map(Object.entries(dataObj));
  };
