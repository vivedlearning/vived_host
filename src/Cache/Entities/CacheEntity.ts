import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";

/**
 * Abstract entity that provides caching functionality for the application.
 * CacheEntity is a singleton component that stores key-value pairs with optional metadata.
 * It provides methods for storing, retrieving, checking existence, and invalidating cached values.
 */
export abstract class CacheEntity extends AppObjectEntity {
  static readonly type = "CacheEntity";

  /**
   * Retrieves a value from the cache by its key.
   * @param key - The unique identifier for the cached item
   * @returns Promise resolving to an object containing the cached value and optional metadata
   * @throws Error if the key does not exist in the cache
   */
  abstract get(
    key: string
  ): Promise<{ value: any; metadata?: Record<string, any> }>;

  /**
   * Stores a value in the cache with an associated key and optional metadata.
   * @param key - The unique identifier for the cached item
   * @param value - The value to cache
   * @param metadata - Optional metadata associated with the cached value
   * @returns Promise that resolves when the value has been stored
   */
  abstract store(
    key: string,
    value: any,
    metadata?: Record<string, any>
  ): Promise<void>;

  /**
   * Checks if a key exists in the cache.
   * @param key - The key to check
   * @returns Promise resolving to boolean indicating if the key exists
   */
  abstract has(key: string): Promise<boolean>;

  /**
   * Removes an item from the cache by its key.
   * @param key - The key to remove
   * @returns Promise that resolves when the key has been invalidated
   */
  abstract invalidate(key: string): Promise<void>;

  /**
   * Removes all items from the cache.
   * @returns Promise that resolves when the cache has been cleared
   */
  abstract clear(): Promise<void>;

  /**
   * Gets the number of items in the cache.
   * @returns Promise resolving to the number of cached items
   */
  abstract size(): Promise<number>;

  /**
   * Gets the singleton instance of CacheEntity from the AppObjectRepo.
   * @param appObjects - The application object repository
   * @returns The CacheEntity instance or undefined if not registered
   */
  static get(appObjects: AppObjectRepo): CacheEntity | undefined {
    return getSingletonComponent<CacheEntity>(CacheEntity.type, appObjects);
  }
}

export function makeCacheEntity(appObject: AppObject): CacheEntity {
  return new CacheEntityImp(appObject);
}

class CacheEntityImp extends CacheEntity {
  private cache: Map<string, { value: any; metadata?: Record<string, any> }> =
    new Map();

  constructor(appObject: AppObject) {
    super(appObject, CacheEntity.type);
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
