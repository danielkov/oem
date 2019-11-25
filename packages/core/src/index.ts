import { join } from "path";

import createLog from "@oem/log";
import { Tree, Command, Config } from "@oem/types";
import { walkObject } from "@oem/util";
import manifest from "@oem/manifest";

const log = createLog("oem:core");

const isTree = (candidate: any): candidate is Tree => {
  return typeof candidate === "object";
};

const oem = async (
  { name, args }: Command,
  config: Config,
  rootDir: string
) => {
  try {
    const unit = config.actions[name];
    log`Selected unit: ${unit}`;
    const { relative } = unit;
    const directory = relative ? process.cwd() : rootDir;
    log`Selected directory: ${directory}, because ${
      relative ? "relative unit" : "absolute unit"
    }`;
    const tree = await unit(args);
    log`Parsing tree`;
    const parseTree = (tree: Tree, dir: string): Promise<any> => {
      log`Walking tree with base directory: ${dir}`;
      manifest.update({ type: "directory", path: dir });
      return walkObject(tree, async (key: string, tplOrTree) => {
        log`Processing unit: ${key}`;
        const nextPath = join(dir, key);
        if (isTree(tplOrTree)) {
          log`${key} contains a tree`;
          log`Making sure ${nextPath} exists`;
          manifest.update({ type: "directory", path: nextPath });
          log`Recurse on tree parsing`;
          return await parseTree(tplOrTree, nextPath);
        }
        log`${key} contains a template`;
        const file = await tplOrTree(args);
        log`Writing new file contents:\n${file}`;
        manifest.update({ type: "file", path: nextPath, contents: file });
      });
    };
    await parseTree(tree, directory);
  } finally {
    log`Done processing`;
  }
  return manifest.get();
};

export default oem;
