import type {
  ArgumentDefinition,
  Command,
  Config,
  Plugin,
} from "@modernist/types";

const countSpacing = (actions: [string, any][]): number => {
  return actions.reduce((spacing, [action]) => {
    return Math.max(spacing, action.length + 1);
  }, 1);
};

const printArguments = (args?: ArgumentDefinition[]) => {
  if (!args) {
    return "";
  }
  const argsEntries: [string, string][] = args.map(
    ({ name, required, description }) => {
      return [
        name.length > 1 ? `--${name}` : `-${name}`,
        `${description || ""} ${required ? "<required>" : ""}`,
      ];
    }
  );
  const spacing = countSpacing(argsEntries);
  return [
    "",
    ...argsEntries.map(([name, description]) => {
      return `        ${name}${"".padEnd(
        spacing - name.length,
        " "
      )}- ${description}`;
    }),
  ].join("\n");
};

const printUsage = (config: Config) => {
  const actions = Object.entries(config.actions);
  const spacing = countSpacing(actions);
  console.log(`modernist [name]

Automagic 🦄 Project Scaffolding with Code Generation.

Commands
${actions
  .map(([name, action]) => {
    return `    ${name}${"".padEnd(spacing - name.length, " ")}- ${
      action.description || ""
    }${printArguments(action.args)}`;
  })
  .join("\n")}
`);
  process.exit(1);
};

const validateArguments = (command: Command, config: Config) => {
  const requiredArgs = (config.actions[command.name].args || []).filter(
    ({ required }) => {
      return !!required;
    }
  );

  for (let index = 0; index < requiredArgs.length; index += 1) {
    const arg = requiredArgs[index].name;
    if (typeof command.args[arg] === "undefined") {
      console.error(`Expected ${arg} to be defined\nUsage:\n`);
      throw new Error();
    }
  }
};

const validator: Plugin = async (command, config, _, next) => {
  if (!command.name) {
    printUsage(config);
  }

  try {
    validateArguments(command, config);
    await next();
  } catch {
    printUsage(config);
  }
};

export default validator;
