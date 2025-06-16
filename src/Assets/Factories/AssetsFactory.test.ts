import { makeAppObjectRepo, DomainFactoryRepo } from "@vived/core";
import { AssetsFactory } from "./AssetsFactory";
import { AssetRepo } from "../Entities/AssetRepo";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  // Create DomainFactoryRepo
  const domainFactoryRepoAO = appObjects.getOrCreate("DomainFactoryRepo");
  new DomainFactoryRepo(domainFactoryRepoAO);

  return { appObjects };
}

describe("AssetsFactory", () => {
  it("should create all required components when instantiated", () => {
    const { appObjects } = makeTestRig();

    // Create the factory
    const assetsAO = appObjects.getOrCreate("Assets");
    new AssetsFactory(assetsAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(appObjects);
    domainFactoryRepo?.setupDomain();

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

    const assetsAO = appObjects.getOrCreate("Assets");
    new AssetsFactory(assetsAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(appObjects);
    domainFactoryRepo?.setupDomain();

    const assetRepo = AssetRepo.get(appObjects);
    expect(assetRepo?.assetFactory).toBeDefined();

    // Test that the asset factory creates assets with proper components
    const testAsset = assetRepo?.assetFactory("test-asset");
    expect(testAsset).toBeDefined();
    expect(testAsset?.id).toBe("test-asset");
  });
});
