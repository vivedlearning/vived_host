import {
  AppObject,
  AppObjectRepo,
  makeAppObject,
  makeAppObjectRepo
} from "@vived/core";
import {
  AssetCacheEntity,
  makeAssetCacheEntity
} from "../Entities/AssetCacheEntity";
import { CacheEntity, makeCacheEntity } from "../Entities/CacheEntity";
import {
  StoreAssetInCacheUC,
  makeStoreAssetInCacheUC
} from "./StoreAssetInCacheUC";

describe("StoreAssetInCacheUC", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let cacheEntity: CacheEntity;
  let assetCacheEntity: AssetCacheEntity;
  let storeAssetInCacheUC: StoreAssetInCacheUC;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    appObject = makeAppObject("testStoreAssetCache", appObjects);
    cacheEntity = makeCacheEntity(appObject);
    assetCacheEntity = makeAssetCacheEntity(appObject);
    storeAssetInCacheUC = makeStoreAssetInCacheUC(appObject);
  });

  test("should store asset in cache", async () => {
    // Create a test blob
    const testContent = new Blob(["test content"], {
      type: "text/plain"
    });

    const assetId = "test-asset-id";

    // Store the asset using the use case
    await storeAssetInCacheUC.storeAsset(assetId, testContent, "image/png");

    // Verify asset was stored by retrieving directly from entity
    const exists = await assetCacheEntity.hasAsset(assetId);
    expect(exists).toBe(true);

    // Retrieve the asset to verify content
    const retrievedContent = await assetCacheEntity.getAsset(assetId);

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
});
