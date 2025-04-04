export abstract class ITimedEntity {
  resolvedAt: Date;
}

// seconds
// const CACHE_TIME = 60 * 60;
const CACHE_TIME = 60;

export const secDiff = (d: Date, d2: Date) => {
  return Math.abs((d.getTime() - d2.getTime()) / 1000);
};

export abstract class RuntimeRepository<
  T extends ITimedEntity,
  KeyName extends keyof T,
  Key = T[KeyName]
> {
  protected cache = new Map<Key, T>();

  abstract resolve(id: Key): Promise<T | undefined>;

  protected constructor(protected readonly ttl: number) {
  }

  get = async (id: Key): Promise<T | null> => {
    const cached = this.cache.get(id);
    if (cached && secDiff(cached.resolvedAt, new Date()) < this.ttl) {
      return cached;
    }
    const loaded = await this.resolve(id);
    if (loaded) {
      await this.save(id, loaded);
      loaded.resolvedAt = new Date();
      return loaded;
    }
  };

  getSync = (id: Key): T | null => {
    return this.cache.get(id) || null;
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
    this.list.forEach((it) => it.cache.clear());
  }
}
