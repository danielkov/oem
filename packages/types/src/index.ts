export type Args = {
  [key: string]: any;
};

export type Template = (args: Args) => string | Promise<string>;

export type Tree = {
  [key: string]: Template | Tree;
};

export type ArgumentDefinition = {
  name: string;
  required?: boolean;
  description?: string;
};

export type Unit = {
  (args: Args): Tree | Promise<Tree>;
  description?: string;
  args?: ArgumentDefinition[];
  relative?: boolean;
};

export type Config = {
  plugins: Plugin[];
  actions: { [key: string]: Unit };
};

export type ManifestEntry = {
  path: string;
  type: "file" | "directory";
  contents?: string;
};

export type Manifest = ManifestEntry[];

export type Command = { name: string; args: Args };

export type Next = { called: boolean; (): Promise<Manifest> };

export type Plugin = (
  command: Command,
  config: Config,
  rootDir: string,
  next: Next
) => void;
