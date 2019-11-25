import {
  exists as fsExists,
  mkdir as fsMkdir,
  writeFile as fsWriteFile,
  readdir as fsReaddir
} from "fs";
import { promisify } from "util";
import { join } from "path";

import createLog from "@modernist/log";
import { Plugin } from "@modernist/types";

const log = createLog("@modernist/fs");

export const exists = promisify(fsExists),
  mkdir = promisify(fsMkdir),
  writeFile = promisify(fsWriteFile),
  readdir = promisify(fsReaddir);

export const ensureDir = async (dir: string) => {
  log`ensureDir: ${dir}`;
  const exist = await exists(dir);
  return exist || (await mkdir(dir, { recursive: true }));
};

export const ensureFile = async (path: string, data: any): Promise<any> => {
  log`ensureFile: ${path}`;
  const dir = join(path, "../");
  await ensureDir(dir);
  return await writeFile(path, data);
};

const commit: Plugin = async (command, config, rootDir, next) => {
  const manifest = await next();
  log`Commiting manifest: ${manifest}`;
  await Promise.all(
    manifest.map(async entry =>
      entry.type === "file"
        ? await ensureFile(entry.path, entry.contents)
        : await ensureDir(entry.path)
    )
  );
};

export default commit;
