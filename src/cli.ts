#!/usr/bin/env node
import { join } from "path";
import { readdir } from "fs";
import yargs from "yargs";
import oem, { OemConfig } from ".";
import { promisify } from "util";
import debug from "debug";

const log = debug("oem:cli");

const read = promisify(readdir);

const findOemDir = async (dir = process.cwd()): Promise<string> => {
  log(`Looking for .oemrc.js in ${dir}`);
  const files = await read(dir);
  if (files.includes(".oemrc.js")) {
    log(`Found .oemrc.js directory: ${dir}`);
    return dir;
  }
  if (dir === "/") {
    log(`Found root directory. Still no .oemrc.js, giving up`);
    throw new Error(`Could not find .oemrc.js relative to ${process.cwd()}`);
  }
  log(`${dir} does not have .oemrc.js, the search continues...`);
  return await findOemDir(join(dir, "../"));
};

log("Attempting to find root directory with .oemrc.js configuration");
findOemDir().then(dir => {
  log(`Loading configuration from ${dir}/.oemrc.js`);
  const config: OemConfig = require(join(dir, ".oemrc.js"));

  log("Adding argument parser configuration");
  // @ts-ignore
  const parser = yargs
    // @ts-ignore
    .usage("Usage: $0 <command> [arguments]")
    // @ts-ignore
    .help("h")
    // @ts-ignore
    .help("help")
    // @ts-ignore
    .demandCommand(1);
  Object.entries(config).forEach(([command, value]) => {
    const desc =
      value.description || `Generates branch ${command} of .oemrc.js`;
    log(`Adding command: ${command} with description: ${desc}`);
    // @ts-ignore
    parser.command({
      command,
      // @ts-ignore
      desc,
      builder: yarr => {
        log(`Start setting up options for command: ${command}`);
        Object.entries(value.args || {}).forEach(([name, desc]) => {
          log(
            `Adding option: ${name} to command: ${command} with description: ${desc}`
          );
          yarr.option(name, { desc });
        });
        return yarr;
      }
    });
  });
  // @ts-ignore
  const { argv } = parser;
  log("Obtained arguments:", argv);

  oem({ name: argv._[0], args: argv }, config, dir);
});
