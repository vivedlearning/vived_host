import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";

export abstract class CacheEntity extends AppObjectEntity {
  static readonly type = "CacheEntity";

  abstract get(
    key: string
  ): Promise<{ value: any; metadata?: Record<string, any> }>;
  abstract store(
    key: string,
    value: any,
    metadata?: Record<string, any>
  ): Promise<void>;
  abstract has(key: string): Promise<boolean>;
  abstract invalidate(key: string): Promise<void>;
  abstract clear(): Promise<void>;
  abstract size(): Promise<number>;

  static get(appObjects: AppObjectRepo): CacheEntity | undefined {
    return getSingletonComponent<CacheEntity>(CacheEntity.type, appObjects);
  }
}

export function makeCacheEntity(appObject: AppObject): CacheEntity {
  return new CacheEntityImp(appObject);
}

class CacheEntityImp extends CacheEntity {
  private cache: Map<string, { value: any; metadata?: Record<string, any> }>;

  constructor(appObject: AppObject) {
    super(appObject, CacheEntity.type);
    this.cache = new Map();
    this.appObjects.registerSingleton(this);
  }

  async get(
    key: string
  ): Promise<{ value: any; metadata?: Record<string, any> }> {
    if (!this.cache.has(key)) {
      throw new Error(`Cache key not found: ${key}`);
    }
    return this.cache.get(key) as {
      value: any;
      metadata?: Record<string, any>;
    };
  }

  async store(
    key: string,
    value: any,
    metadata?: Record<string, any>
  ): Promise<void> {
    this.cache.set(key, { value, metadata });
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  async invalidate(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async size(): Promise<number> {
    return this.cache.size;
  }
}
