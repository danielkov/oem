export const walkObject = async <K extends string | number, V, R>(
  object: { [key in K]: V },
  cb: (key: K, value: V) => Promise<R>
) => {
  return Promise.all(
    Object.entries(object).map(([key, value]) => {
      return cb(key as K, value as V);
    })
  );
};

export const isObject = (
  candidate: unknown
): candidate is Record<string, unknown> => {
  return (
    candidate !== null &&
    typeof candidate === "object" &&
    !Array.isArray(candidate)
  );
};

export const merge = <T extends Record<string, unknown>>(
  original: T,
  updates: Partial<T>
) => {
  const result: T = { ...original };
  Object.entries(updates).forEach(([key, value]) => {
    if (
      !Object.prototype.hasOwnProperty.call(result, key) ||
      !isObject(updates[key])
    ) {
      result[<keyof T>key] = value;
    } else {
      result[<keyof T>key] = merge(
        result[<keyof T>key] as Record<string, unknown>,
        (updates[key] as Record<string, unknown>) || {}
      ) as any;
    }
  });
  return result;
};
