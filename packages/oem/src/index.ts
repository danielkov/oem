#! /usr/bin/env node
import cli from "@oem/cli";
import oem from "@oem/core";
import configure from "@oem/config";
import createLog from "@oem/log";
import plugin from "@oem/plugin";
import commit from "@oem/fs";

const log = createLog("oem");

const index = async () => {
  log`Getting configuration`;
  const { config, directory } = await configure();
  log`Got config: ${config} in directory: ${directory}`;
  log`Parsing command line arguments`;
  const { command: name, args } = await cli(config);
  log`Got command: ${name} and arguments: ${args}`;
  log`Initializing plugins`;
  const { plugins } = config;
  await plugin([oem, ...plugins, commit])({ name, args }, config, directory);
};

index();
