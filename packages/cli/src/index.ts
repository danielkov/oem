import debug from "debug";
import * as program from "commander";

import { OemConfig } from "@oem/types";

const log = debug("oem:cli");

const cli = async (config: OemConfig, dir: string) => {
  log("Adding argument parser configuration");
  const { version } = require("../package.json");
  log(`Reported version: ${version}`);
  program.option("-d, --debug", "output CLI arguments").version(version);

  Object.entries(config).forEach(([command, value]) => {
    const desc =
      value.description || `Generates branch ${command} of .oemrc.js`;
    log(`Start setting up options for command: ${command}`);
    log(`Adding command: ${command} with description: ${desc}`);
    let action = program.command(`<${command}>`, desc);
    Object.entries(value.args || {}).forEach(([name, desc]) => {
      log(
        `Adding option: ${name} to command: ${command} with description: ${desc}`
      );
      action = action.option(`--${name}`, desc);
    });
    action.action((cmd) => {
      console.dir(cmd);
    });
  });

  program.parse(process.argv);

  // log("Obtained arguments:", argv);
  // return { command: { name: argv._[0], args: argv }, config, dir };
};

export default cli;
