export type OemArgs = {
  [key: string]: any;
};

export type OemTemplate = (args: OemArgs) => string | Promise<string>;

export type OemTree = {
  [key: string]: OemTemplate | OemTree;
};

export type OemArgumentDefinition = {
  name: string;
  type: "Boolean" | "Number" | "String";
  description?: string;
};

export type OemUnit = {
  (args: OemArgs): OemTree | Promise<OemTree>;
  description?: string;
  args?: [OemArgumentDefinition];
  relative?: boolean;
};

export type OemConfig = {
  [key: string]: OemUnit;
};

export type OemCommand = { name: string; args: OemArgs };
