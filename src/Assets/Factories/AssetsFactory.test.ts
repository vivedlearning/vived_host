import { makeAppObjectRepo } from "@vived/core";
import { AssetsFactory } from "./AssetsFactory";
import { setupAssets } from "./setupAssets";
import { AssetRepo } from "../Entities/AssetRepo";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  return { appObjects };
}

describe("AssetsFactory", () => {
  it("should create all required components when instantiated", () => {
    const { appObjects } = makeTestRig();
    
    // Create the factory
    new AssetsFactory(appObjects);
    
    // Verify that the required AppObjects were created
    expect(appObjects.has("Asset Repository")).toBe(true);
    expect(appObjects.has("App Assets")).toBe(true);
    
    // Verify that the singleton components are registered
    const assetRepo = AssetRepo.get(appObjects);
    expect(assetRepo).toBeDefined();
    
    const appAssets = AppAssetsEntity.get(appObjects);
    expect(appAssets).toBeDefined();
  });

  it("should set up the asset factory correctly", () => {
    const { appObjects } = makeTestRig();
    
    new AssetsFactory(appObjects);
    
    const assetRepo = AssetRepo.get(appObjects);
    expect(assetRepo?.assetFactory).toBeDefined();
    
    // Test that the asset factory creates assets with proper components
    const testAsset = assetRepo?.assetFactory("test-asset");
    expect(testAsset).toBeDefined();
    expect(testAsset?.id).toBe("test-asset");
  });
});

describe("setupAssets", () => {
  it("should create AssetsFactory and Assets Domain AppObject", () => {
    const { appObjects } = makeTestRig();
    
    setupAssets(appObjects);
    
    // Verify that the Assets Domain AppObject was created
    expect(appObjects.has("Assets Domain")).toBe(true);
    
    // Verify that the asset system components are set up
    expect(appObjects.has("Asset Repository")).toBe(true);
    expect(appObjects.has("App Assets")).toBe(true);
  });

  it("should maintain the same functionality as setupAssetsForSandbox", () => {
    const { appObjects } = makeTestRig();
    
    // Set up using the new factory
    setupAssets(appObjects);
    
    // Verify core functionality
    const assetRepo = AssetRepo.get(appObjects);
    expect(assetRepo).toBeDefined();
    
    const appAssets = AppAssetsEntity.get(appObjects);  
    expect(appAssets).toBeDefined();
    
    // Test asset creation
    const asset = assetRepo?.getOrCreate("test-asset");
    expect(asset).toBeDefined();
    expect(asset?.id).toBe("test-asset");
  });
});