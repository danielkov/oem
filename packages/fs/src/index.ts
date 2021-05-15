import {
  exists as fsExists,
  mkdir as fsMkdir,
  writeFile as fsWriteFile,
  readdir as fsReaddir,
} from "fs";
import { join } from "path";
import { promisify } from "util";

import createLog from "@modernist/log";
import { Plugin } from "@modernist/types";

const log = createLog("@modernist/fs");

export const exists = promisify(fsExists);
export const mkdir = promisify(fsMkdir);
export const writeFile = promisify(fsWriteFile);
export const readdir = promisify(fsReaddir);

export const ensureDir = async (dir: string) => {
  log`ensureDir: ${dir}`;
  const exist = await exists(dir);
  return exist || mkdir(dir, { recursive: true });
};

export const ensureFile = async (path: string, data: any): Promise<any> => {
  log`ensureFile: ${path}`;
  const dir = join(path, "../");
  await ensureDir(dir);
  return writeFile(path, data);
};

const commit: Plugin = async (command, config, rootDir, next) => {
  const manifest = await next();
  log`Commiting manifest: ${manifest}`;
  await Promise.all(
    manifest.map(async (entry) => {
      return entry.type === "file"
        ? ensureFile(entry.path, entry.contents)
        : ensureDir(entry.path);
    })
  );
};

export default commit;
