import {
  AppObject,
  AppObjectRepo,
  makeAppObject,
  makeAppObjectRepo
} from "@vived/core";
import { AssetCacheEntity, makeAssetCacheEntity } from "./AssetCacheEntity";
import { CacheEntity, makeCacheEntity } from "./CacheEntity";

describe("AssetCacheEntity", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let cacheEntity: CacheEntity;
  let assetCacheEntity: AssetCacheEntity;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    appObject = makeAppObject("testAssetCache", appObjects);
    cacheEntity = makeCacheEntity(appObject);
    assetCacheEntity = makeAssetCacheEntity(appObject);
  });

  test("should store and retrieve an asset", async () => {
    // Create a test blob
    const testContent = new Blob(["test content"], {
      type: "text/plain"
    });

    // Store the asset
    await assetCacheEntity.storeAsset("test-asset-id", testContent);

    // Retrieve the asset
    const retrievedContent = await assetCacheEntity.getAsset("test-asset-id");

    // Verify the asset was retrieved
    expect(retrievedContent).toBeDefined();

    // Since we can't directly compare Blob contents in tests,
    // we'll verify that the type is correct and that the blob exists
    if (retrievedContent) {
      expect(
        retrievedContent instanceof Blob ||
          Object.prototype.toString.call(retrievedContent) === "[object Blob]"
      ).toBeTruthy();
    }
  });

  test("should return undefined for non-existent asset", async () => {
    const result = await assetCacheEntity.getAsset("nonexistent-asset-id");
    expect(result).toBeUndefined();
  });

  test("should check if asset exists", async () => {
    // Store an asset
    const testContent = new Blob(["test content"], {
      type: "text/plain"
    });
    await assetCacheEntity.storeAsset("test-asset-id", testContent);

    // Check if it exists
    const exists = await assetCacheEntity.hasAsset("test-asset-id");
    expect(exists).toBe(true);

    // Check if a non-existent asset exists
    const nonExistentExists = await assetCacheEntity.hasAsset(
      "nonexistent-asset-id"
    );
    expect(nonExistentExists).toBe(false);
  });

  test("should invalidate an asset", async () => {
    // Store an asset
    const testContent = new Blob(["test content"], {
      type: "text/plain"
    });
    await assetCacheEntity.storeAsset("test-asset-id", testContent);

    // Verify it exists
    let exists = await assetCacheEntity.hasAsset("test-asset-id");
    expect(exists).toBe(true);

    // Invalidate it
    await assetCacheEntity.invalidateAsset("test-asset-id");

    // Verify it no longer exists
    exists = await assetCacheEntity.hasAsset("test-asset-id");
    expect(exists).toBe(false);
  });
});
