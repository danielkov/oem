#! /usr/bin/env node
import cli from "@modernist/cli";
import configure from "@modernist/config";
import modernist from "@modernist/core";
import commit from "@modernist/fs";
import createLog from "@modernist/log";
import plugin from "@modernist/plugin";

const log = createLog("modernist");

const index = async () => {
  log`Getting configuration`;
  const { config, directory } = await configure();
  log`Got config: ${config} in directory: ${directory}`;
  log`Parsing command line arguments`;
  const { command: name, args } = await cli(config);
  log`Got command: ${name} and arguments: ${args}`;
  log`Initializing plugins`;
  const { plugins } = config;
  await plugin([modernist, ...plugins, commit])(
    { name, args },
    config,
    directory
  );
};

index();
