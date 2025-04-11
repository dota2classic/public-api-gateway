import * as memoize from "memoizee";

export const memoize2 =
  (options?: memoize.Options<any>) =>
  (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = memoize(originalMethod, options);
  };
