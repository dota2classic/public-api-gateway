export function Retry(
  retries: number = 5,
  delay: number = 1000,
  factor: number = 2
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let attempt = 0;
      let currentDelay = delay;

      while (true) {
        try {
          return await originalMethod.apply(this, args);
        } catch (err) {
          attempt++;
          if (attempt > retries) throw err;
          console.log(`Retrying ${propertyKey}, attempt ${attempt}...`);
          await new Promise(res => setTimeout(res, currentDelay));
          currentDelay *= factor;
        }
      }
    };

    return descriptor;
  };
}
