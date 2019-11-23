import { OemConfig } from "@oem/types";
import createLog from "@oem/log";

const log = createLog("oem:cli");

const stripDash = (argument: string) => argument.replace(/^-?-/, "");

const isArgumentName = (candidate: string) => /^(-\w$)|(--\w+)/.test(candidate);

const parse = (args: string[]) => {
  const parsed: any = {};
  for (let index = 0; index < args.length; index++) {
    let argument = args[index];
    if (!isArgumentName(argument)) {
      throw new Error(`Failed to parse argument: ${argument} - invalid name`);
    }
    let value;
    const split = argument.split("=");
    if (split[1]) {
      value = split[1];
      argument = split[0];
    } else if (args[index + 1] && !isArgumentName(args[index + 1])) {
      value = args[index + 1];
      index += 1;
    } else {
      value = true;
    }
    parsed[stripDash(argument)] = value;
  }
  return parsed;
};

const cli = async (config: OemConfig) => {
  log`Adding argument parser configuration`;
  const { version } = require("../package.json");
  log`Reported version: ${version}`;

  Object.entries(config).forEach(([command, value]) => {
    const desc =
      value.description || `Generates branch ${command} of .oemrc.js`;
    log`Start setting up options for command: ${command}`;
    log`Adding command: ${command} with description: ${desc}`;
    Object.entries(value.args || {}).forEach(([name, desc]) => {
      log`Adding option: ${name} to command: ${command} with description: ${desc}`;
    });
  });

  const command = process.argv[2];

  const args = parse(process.argv.slice(3));

  return { command, args };
};

export default cli;
