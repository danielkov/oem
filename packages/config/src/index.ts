import { readdir } from "@oem/fs";
import { join } from "path";

import createLog from "@oem/log";
import { Config } from "@oem/types";

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
  const config: Config = require(join(directory, ".oemrc.js"));
  return { directory, config };
};

export default config;
