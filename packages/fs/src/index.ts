import {
  exists as fsExists,
  mkdir as fsMkdir,
  writeFile as fsWriteFile,
  readdir as fsReaddir
} from "fs";
import { promisify } from "util";

const exists = promisify(fsExists),
  mkdir = promisify(fsMkdir),
  writeFile = promisify(fsWriteFile),
  readdir = promisify(fsReaddir);

const ensureDir = async (dir: string) => {
  const exist = await exists(dir);
  return exist || (await mkdir(dir, { recursive: true }));
};

export { ensureDir, writeFile, readdir };
