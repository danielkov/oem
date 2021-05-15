const packageJson =
  (plugin) =>
  ({ name }) =>
    `{
  "name": "@modernist/${plugin ? `plugin-${name}` : name}",
  "version": "1.0.0",
  "description": "Automagic 🦄 Project Scaffolding with Code Generation - ${name}",
  "main": "dist/index",
  "types": "dist/index",
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "npm run clean && npm run compile",
    "clean": "rm -rf ./dist",
    "compile": "tsc -p tsconfig.build.json",
    "lint": "eslint src/index.ts"
  },
  "devDependencies": {
    "eslint": "7.26.0",
    "typescript": "4.2.4"
  },
  "dependencies": {},
  "author": "Daniel Emod Kovacs <kovacsemod@gmail.com>",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  }
}
`;

const tsConfigBuild = () => `{
  "extends": "../../tsconfig.build.json",

  "compilerOptions": {
    "outDir": "./dist"
  },

  "include": ["src/**/*"]
}
`;

const tsConfig = () => `{
  "extends": "../../tsconfig.json"
}
`;

const packageContent = (plugin) => ({
  src: {
    "index.ts": () => ``,
  },
  "package.json": packageJson(plugin),
  "tsconfig.build.json": tsConfigBuild,
  "tsconfig.json": tsConfig,
});

const package = ({ name, plugin }) => ({
  [plugin ? "plugins" : "packages"]: {
    [name]: packageContent(false),
  },
});

package.description = "create a new package";

package.args = [
  {
    name: "name",
    description: "name of the package",
    required: true,
  },
  {
    name: "plugin",
    description: "is this a plugin?",
  },
];

module.exports = {
  actions: {
    package,
  },
  plugins: [require("./plugins/validator/dist/index").default],
};
