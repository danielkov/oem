import createLog from "@oem/log";
import manifest from "@oem/manifest";
import { Plugin, Config, Command, Next } from "@oem/types";

const log = createLog("@oem/plugin");

const plugin = (plugins: Plugin[]) => {
  log`Got plugins: ${plugins}`;
  return async (command: Command, config: Config, rootDir: string) => {
    log`Got command: ${command}, config: ${config}, rootDir: ${rootDir}`;
    log`Stacking plugins to be called first to last`;
    // @ts-ignore - TypeScript does not play well with reduce, but this works, I promise
    await plugins.reduce(async (prev: Promise<void>, current: Plugin) => {
      log`Adding plugin: ${current}`;
      const next: Next = async () => {
        log`Next called`;
        await prev;
        next.called = true;
        return manifest.get();
      };
      next.called = false;
      log`Wrapping plugin to guard against not calling next()`;
      return (async () => {
        await current(command, config, rootDir, next);
        if (!next.called) {
          log`Next was not called, calling it after plugin`;
          await next();
        }
      })();
    }, Promise.resolve);
  };
};

export default plugin;
