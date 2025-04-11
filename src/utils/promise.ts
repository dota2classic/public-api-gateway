// @ts-ignore
Promise.combine = function (this, promises: any[]) {
  return Promise.all(promises) as any;
};
