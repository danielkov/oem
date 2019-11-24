const isObject = (candidate: unknown): candidate is object => {
  return candidate !== "null" && typeof candidate === "object";
};

const merge = <T extends any>(original: T, updates: Partial<T>) => {
  const result: T = { ...original };
  Object.entries(updates).forEach(([key, value]) => {
    if (!result.hasOwnProperty(key) || !isObject(updates[key])) {
      result[key] = value;
    } else {
      result[key] = merge(result[key], updates[key]!);
    }
  });
  return result;
};

const createManifest = () => {
  let manifest: any = {};
  const update = (part: any) => {
    merge(manifest, part);
  };
  const get = () => {
    return manifest;
  };
  return { update, get };
};

export default createManifest;
