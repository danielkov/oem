import { ensureDir, writeFile } from "@oem/fs";
import { join } from "path";

import createLog from "@oem/log";
import { OemTree, OemCommand, OemConfig } from "@oem/types";

const log = createLog("oem:core");

const walkObject = async <K extends string | number, V, R>(
  object: { [key in K]: V },
  cb: (key: K, value: V) => Promise<R>
) =>
  Promise.all(
    Object.entries(object).map(([key, value]) => cb(key as K, value as V))
  );

const isTree = (candidate: any): candidate is OemTree => {
  return typeof candidate === "object";
};

const oem = async (
  { name, args }: OemCommand,
  config: OemConfig,
  rootDir: string
) => {
  try {
    log`Making sure directory exists: ${rootDir}`;
    await ensureDir(rootDir);
    const unit = config[name];
    log`Selected unit: ${unit}`;
    const { relative } = unit;
    const dir = relative ? process.cwd() : rootDir;
    log`Selected directory: ${dir}, because ${
      relative ? "relative unit" : "absolute unit"
    }`;
    const tree = await unit(args);
    log`Parsing tree`;
    const parseTree = (tree: OemTree, dir: string): Promise<any> => {
      log`Walking tree with base directory: ${dir}`;
      return walkObject(tree, async (key: string, tplOrTree) => {
        log`Processing unit: ${key}`;
        const nextPath = join(dir, key);
        if (isTree(tplOrTree)) {
          log`${key} contains a tree`;
          log`Making sure ${nextPath} exists`;
          await ensureDir(nextPath);
          log`Recurse on tree parsing`;
          return await parseTree(tplOrTree, nextPath);
        }
        log`${key} contains a template`;
        const file = await tplOrTree(args);
        log`Writing new file contents:\n${file}`;
        await writeFile(nextPath, file);
      });
    };
    await parseTree(tree, dir);
  } finally {
    log`Done processing`;
  }
};

export default oem;
