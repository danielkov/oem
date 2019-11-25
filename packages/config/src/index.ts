import { join } from "path";

import { isObject } from "@oem/util";
import { readdir } from "@oem/fs";
import createLog from "@oem/log";
import { Config, Unit } from "@oem/types";

const log = createLog("oem:config");

const findDirectory = async (dir = process.cwd()): Promise<string> => {
  log`Looking for .oemrc.js in ${dir}`;
  const files = await readdir(dir);
  if (files.includes(".oemrc.js")) {
    log`Found .oemrc.js directory: ${dir}`;
    return dir;
  }
  if (dir === "/") {
    log`Found root directory. Still no .oemrc.js, giving up`;
    throw new Error(`Could not find .oemrc.js relative to ${process.cwd()}`);
  }
  log`${dir} does not have .oemrc.js, the search continues...`;
  return await findDirectory(join(dir, "../"));
};

const config = async (): Promise<{ directory: string; config: Config }> => {
  const directory = await findDirectory();
  log`Found directory: ${directory}`;
  log`Loading config from ${directory}/.oemrc.js`;
  /* eslint-disable-next-line @typescript-eslint/no-var-requires */
  const config: any = require(join(directory, ".oemrc.js"));
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
      directory
    };
  }
  throw new Error("Configuration is incorrect");
};

export default config;
