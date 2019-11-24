import {
  exists as fsExists,
  mkdir as fsMkdir,
  writeFile as fsWriteFile,
  readdir as fsReaddir
} from "fs";
import { promisify } from "util";
import { join } from "path";

import { Manifest } from "@oem/types";

export const exists = promisify(fsExists),
  mkdir = promisify(fsMkdir),
  writeFile = promisify(fsWriteFile),
  readdir = promisify(fsReaddir);

export const ensureDir = async (dir: string) => {
  const exist = await exists(dir);
  return exist || (await mkdir(dir, { recursive: true }));
};

export const ensureFile = async (path: string, data: any): Promise<any> => {
  const dir = join(path, "../");
  await ensureDir(dir);
  return await writeFile(path, data);
};

export const commit = async (next: () => Promise<Manifest>) => {
  const manifest = await next();
  await Promise.all(
    manifest.map(async entry =>
      entry.type === "file"
        ? await ensureFile(entry.path, entry.contents)
        : await ensureDir(entry.path)
    )
  );
};
