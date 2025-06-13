import { makeAppObjectRepo } from "@vived/core";
import { AssetsFactory } from "./AssetsFactory";
import { setupAssets } from "./setupAssets";
import { setupAssetsForSandbox } from "./setupAssetsForSandbox";
import { AssetRepo } from "../Entities/AssetRepo";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";

describe("Assets Factory Compatibility", () => {
  it("should produce the same result as setupAssetsForSandbox", () => {
    // Set up using the old function
    const appObjectsOld = makeAppObjectRepo();
    setupAssetsForSandbox(appObjectsOld);

    // Set up using the new factory
    const appObjectsNew = makeAppObjectRepo();
    setupAssets(appObjectsNew);

    // Compare the results

    // Both should have Asset Repository
    const assetRepoOld = AssetRepo.get(appObjectsOld);
    const assetRepoNew = AssetRepo.get(appObjectsNew);
    expect(assetRepoOld).toBeDefined();
    expect(assetRepoNew).toBeDefined();

    // Both should have App Assets
    const appAssetsOld = AppAssetsEntity.get(appObjectsOld);
    const appAssetsNew = AppAssetsEntity.get(appObjectsNew);
    expect(appAssetsOld).toBeDefined();
    expect(appAssetsNew).toBeDefined();

    // Both should have working asset factories
    expect(assetRepoOld?.assetFactory).toBeDefined();
    expect(assetRepoNew?.assetFactory).toBeDefined();

    // Test asset creation works the same way
    const testAssetOld = assetRepoOld?.getOrCreate("test-asset");
    const testAssetNew = assetRepoNew?.getOrCreate("test-asset");

    expect(testAssetOld).toBeDefined();
    expect(testAssetNew).toBeDefined();
    expect(testAssetOld?.id).toBe("test-asset");
    expect(testAssetNew?.id).toBe("test-asset");

    // Both assets should have the same structure
    expect(testAssetOld?.name).toBeDefined();
    expect(testAssetNew?.name).toBeDefined();
    expect(testAssetOld?.description).toBeDefined();
    expect(testAssetNew?.description).toBeDefined();
  });

  it("should maintain all AppObject structure", () => {
    const appObjects = makeAppObjectRepo();
    setupAssets(appObjects);

    // Verify all expected AppObjects exist
    expect(appObjects.has("Assets Domain")).toBe(true);
    expect(appObjects.has("Asset Repository")).toBe(true);
    expect(appObjects.has("App Assets")).toBe(true);

    // Verify when we create an asset, its AppObject is created
    const assetRepo = AssetRepo.get(appObjects);
    const asset = assetRepo?.getOrCreate("test-asset-1");
    expect(asset).toBeDefined();
    expect(appObjects.has("test-asset-1")).toBe(true);
  });
});
