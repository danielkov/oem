import { join } from "path";

import { readdir } from "@modernist/fs";
import createLog from "@modernist/log";
import { Config, Unit } from "@modernist/types";
import { isObject } from "@modernist/util";

const log = createLog("modernist/config");

const findDirectory = async (dir = process.cwd()): Promise<string> => {
  log`Looking for .modernistrc.js in ${dir}`;
  const files = await readdir(dir);
  if (files.includes(".modernistrc.js")) {
    log`Found .modernistrc.js directory: ${dir}`;
    return dir;
  }
  if (dir === "/") {
    log`Found root directory. Still no .modernistrc.js, giving up`;
    throw new Error(
      `Could not find .modernistrc.js relative to ${process.cwd()}`
    );
  }
  log`${dir} does not have .modernistrc.js, the search continues...`;
  return findDirectory(join(dir, "../"));
};

const configure = async (): Promise<{ directory: string; config: Config }> => {
  const directory = await findDirectory();
  log`Found directory: ${directory}`;
  log`Loading config from ${directory}/.modernistrc.js`;
  /* eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require */
  const config: any = require(join(directory, ".modernistrc.js"));
  log`Found config: ${config}`;
  log`Determining if config is correct`;
  if (config.actions) {
    log`config.actions is present with value: ${config.actions}`;
    return { directory, config };
  }
  log`Possible old config shape or incorrect`;
  if (isObject(config)) {
    log`We have an object exported, so we assume it's an action definition`;
    return {
      config: { actions: config as { [key: string]: Unit }, plugins: [] },
      directory,
    };
  }
  throw new Error("Configuration is incorrect");
};

export default configure;
