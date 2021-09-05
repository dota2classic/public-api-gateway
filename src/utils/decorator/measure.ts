import { performance } from 'perf_hooks';


export function measureN<T>(callback: () => T, msg: string = ""): T{
  const start = performance.now();
  const result = callback();
  if (result instanceof Promise) {
    result.then(() => {
      const finish = performance.now();
      console.log(`Promise execution time: ${finish - start} milliseconds, ` + msg);
    });
  } else {
    const finish = performance.now();
    console.log(`Execution time: ${finish - start} milliseconds, ` + msg) ;
  }

  return result;
}
export const measure = (
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    if (result instanceof Promise) {
      result.then(() => {
        const finish = performance.now();
        console.log(`Promise execution time: ${finish - start} milliseconds`);
      });
    } else {
      const finish = performance.now();
      console.log(`Execution time: ${finish - start} milliseconds`);
    }

    return result;
  };
};
