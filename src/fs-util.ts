import {
  stat,
  readdir,
} from 'fs/promises';

export const isDirectory = async (dirPath: string): Promise<boolean> => {
  try {
    const st = await stat(dirPath);
    return st.isDirectory();
  } catch (e) {
    if (e.code !== 'ENOENT') {
      throw e;
    }
    return false;
  }
};

export const isEmptyDirectory = async (dirPath: string): Promise<boolean> => {
  const entries = await readdir(dirPath);
  return entries.length === 0;
};
