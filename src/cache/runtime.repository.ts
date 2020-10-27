export abstract class RuntimeRepository<
  T,
  KeyName extends keyof T,
  Key = T[KeyName]
> {
  protected cache = new Map<Key, T>();

  abstract async resolve(id: Key): Promise<T>;

  get = async (id: Key): Promise<T | null> => {
    const cached = this.cache.get(id);
    if (cached) {
      return cached;
    }
    const loaded = await this.resolve(id);
    if (loaded) {
      await this.save(id, loaded);
      return loaded;
    }
  };

  save = async (id: Key, item: T) => {
    this.cache.set(id, item);
  };

  update = async (id: Key, item: T) => {
    this.cache.set(id, item);
  };
  delete = async (id: Key) => {
    this.cache.delete(id);
  };

  all = async () => [...this.cache.values()];

  private static list: RuntimeRepository<any, any>[] = [];

  private static clearAll() {
    this.list.forEach(it => it.cache.clear());
  }
}
