import { ensureDir, writeFile } from "fs-extra";
import { join } from "path";
import debug from "debug";

const log = debug("oem:core");

const walkObject = async (object, cb) =>
  Promise.all(Object.entries(object).map(([key, value]) => cb(key, value)));

export type OemArgs = {
  [key: string]: any;
};

export type OemTemplate = (args: OemArgs) => string | Promise<string>;

const isTree = (candidate): candidate is OemTree => {
  return typeof candidate === "object";
};

export type OemTree = {
  [key: string]: OemTemplate | OemTree;
};

export type OemUnit = {
  (args: OemArgs): OemTree | Promise<OemTree>;
  description?: string;
  args?: { [key: string]: string };
};

export type OemConfig = {
  [key: string]: OemUnit;
};

export type OemCommand = { name: string; args: OemArgs };

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
    const parseTree = (tree: OemTree, dir: string) => {
      log(`Walking tree with base directory: ${dir}`);
      return walkObject(tree, async (key, tplOrTree) => {
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
