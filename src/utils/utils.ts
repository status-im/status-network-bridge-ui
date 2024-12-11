export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export function keys<O extends Record<string, unknown>>(obj: O): (keyof O)[] {
  return Object.keys(obj) as (keyof O)[];
}