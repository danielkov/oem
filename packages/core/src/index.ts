import { ensureDir, writeFile } from "fs-extra";
import { join } from "path";
import debug from "debug";
import { OemTree, OemCommand, OemConfig } from "@oem/types";

const log = debug("oem:core");

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
  rootDir: string = process.cwd()
) => {
  try {
    log(`Making sure directory exists: ${rootDir}`);
    await ensureDir(rootDir);
    const tree = await config[name](args);
    log("Parsing tree");
    const parseTree = (tree: OemTree, dir: string): Promise<any> => {
      log(`Walking tree with base directory: ${dir}`);
      return walkObject(tree, async (key: string, tplOrTree) => {
        log(`Processing unit: ${key}`);
        const nextPath = join(dir, key);
        if (isTree(tplOrTree)) {
          log(`${key} contains a tree`);
          log(`Making sure ${nextPath} exists`);
          await ensureDir(nextPath);
          log("Recurse on tree parsing");
          return await parseTree(tplOrTree, nextPath);
        }
        log(`${key} contains a template`);
        const file = await tplOrTree(args);
        log(`Writing new file contents:\n${file}`);
        await writeFile(nextPath, file);
      });
    };
    await parseTree(tree, rootDir);
  } finally {
    log("Done processing");
  }
};

export default oem;
