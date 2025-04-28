import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { CacheEntity, makeCacheEntity } from "./CacheEntity";

describe("CacheEntity", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let cacheEntity: CacheEntity;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate("testCache");
    cacheEntity = makeCacheEntity(appObject);
  });

  it("initializes with empty cache", () => {
    expect(cacheEntity).toBeDefined();
    return cacheEntity.clear().then(() => {
      return cacheEntity.size().then((size) => {
        expect(size).toBe(0);
      });
    });
  });

  it("stores and retrieves values", async () => {
    const key = "test-key";
    const value = "test-value";
    const metadata = { timestamp: Date.now() };

    await cacheEntity.store(key, value, metadata);

    const result = await cacheEntity.get(key);
    expect(result.value).toBe(value);
    expect(result.metadata).toEqual(metadata);
  });

  it("checks if key exists", async () => {
    const key = "exists-key";

    expect(await cacheEntity.has(key)).toBe(false);

    await cacheEntity.store(key, "some value");

    expect(await cacheEntity.has(key)).toBe(true);
  });

  it("invalidates a key", async () => {
    const key = "invalidate-key";

    await cacheEntity.store(key, "some value");
    expect(await cacheEntity.has(key)).toBe(true);

    await cacheEntity.invalidate(key);
    expect(await cacheEntity.has(key)).toBe(false);
  });

  it("clears all entries", async () => {
    await cacheEntity.store("key1", "value1");
    await cacheEntity.store("key2", "value2");

    expect(await cacheEntity.size()).toBe(2);

    await cacheEntity.clear();
    expect(await cacheEntity.size()).toBe(0);
  });
});
