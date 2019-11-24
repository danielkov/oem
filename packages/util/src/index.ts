export const walkObject = async <K extends string | number, V, R>(
  object: { [key in K]: V },
  cb: (key: K, value: V) => Promise<R>
) =>
  Promise.all(
    Object.entries(object).map(([key, value]) => cb(key as K, value as V))
  );

export const isObject = (candidate: unknown): candidate is object => {
  return candidate !== "null" && typeof candidate === "object";
};

export const merge = <T extends any>(original: T, updates: Partial<T>) => {
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
