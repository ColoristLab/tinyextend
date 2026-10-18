function extend<T extends object, S extends object[]>(
  target: T,
  ...sources: S
): T & UnionToIntersection<S[number]>;

function extend<T extends object, S extends object[]>(
  deep: boolean,
  target: T,
  ...sources: S
): T & UnionToIntersection<S[number]>;

function extend(...args: unknown[]): object {
  let deep = false;

  if (typeof args[0] === "boolean") {
    deep = args.shift() as boolean;
  }

  const target = args.shift();

  if (isUnextendable(target)) {
    throw new Error("extendee must be an object");
  }

  const seen = new WeakMap<object, object>();

  for (const src of args) {
    if (!isUnextendable(src)) {
      merge(target, src, deep, seen);
    }
  }

  return target;
}

function merge(target: object, src: object, deep: boolean, seen: WeakMap<object, object>): object {
  const cached = seen.get(src);

  if (cached) {
    return cached;
  }

  seen.set(src, target);

  for (const key of Reflect.ownKeys(src)) {
    const value = Reflect.get(src, key);

    if (deep && value !== null && typeof value === "object") {
      let targetVal = Reflect.get(target, key);

      if (targetVal === null || typeof targetVal !== "object") {
        targetVal = Array.isArray(value) ? [] : {};
      }

      Reflect.set(target, key, merge(targetVal, value, true, seen));
    } else {
      Reflect.set(target, key, value);
    }
  }

  return target;
}

function isUnextendable(
  val: unknown,
): val is null | undefined | string | number | boolean | symbol {
  return val == null || (typeof val !== "object" && typeof val !== "function");
}

type UnionToIntersection<U> = (U extends unknown ? (value: U) => void : never) extends (
  value: infer I,
) => void
  ? I
  : never;

export { extend };
