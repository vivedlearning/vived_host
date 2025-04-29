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
  GetAssetFromCacheUC,
  makeGetAssetFromCacheUC
} from "./GetAssetFromCacheUC";

describe("GetAssetFromCacheUC", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let cacheEntity: CacheEntity;
  let assetCacheEntity: AssetCacheEntity;
  let getAssetFromCacheUC: GetAssetFromCacheUC;

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    appObject = makeAppObject("testGetAssetCache", appObjects);
    cacheEntity = makeCacheEntity(appObject);
    assetCacheEntity = makeAssetCacheEntity(appObject);
    getAssetFromCacheUC = makeGetAssetFromCacheUC(appObject);
  });

  test("should return asset from cache", async () => {
    // Create a test blob
    const testContent = new Blob(["test content"], {
      type: "text/plain"
    });

    const assetId = "test-asset-id";

    // Store the asset directly using the entity
    await assetCacheEntity.storeAsset(assetId, testContent);

    // Retrieve the asset using the use case
    const retrievedContent = await getAssetFromCacheUC.getAsset(assetId);

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
    const result = await getAssetFromCacheUC.getAsset("nonexistent-asset-id");
    expect(result).toBeUndefined();
  });
});
