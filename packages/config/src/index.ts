import { readdir } from "fs-extra";
import { join } from "path";

import createLog from "@oem/log";
import { OemConfig } from "@oem/types";

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

const config = async (): Promise<{ directory: string; config: OemConfig }> => {
  const directory = await findDirectory();
  const config: OemConfig = require(join(directory, ".oemrc.js"));
  return { directory, config };
};

export default config;
