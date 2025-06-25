import { makeAppObjectRepo, DomainFactoryRepo } from "@vived/core";
import { CacheFeatureFactory } from "./CacheFeatureFactory";
import { CacheEntity } from "../Entities/CacheEntity";
import { ScriptCacheEntity } from "../Entities/ScriptCacheEntity";
import { AssetCacheEntity } from "../Entities/AssetCacheEntity";
import { GetScriptFromCacheUC } from "../UCs/GetScriptFromCacheUC";
import { StoreScriptInCacheUC } from "../UCs/StoreScriptInCacheUC";
import { GetAssetFromCacheUC } from "../UCs/GetAssetFromCacheUC";
import { StoreAssetInCacheUC } from "../UCs/StoreAssetInCacheUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  // Create DomainFactoryRepo
  const domainFactoryRepoAO = appObjects.getOrCreate("DomainFactoryRepo");
  new DomainFactoryRepo(domainFactoryRepoAO);

  return { appObjects };
}

describe("CacheFeatureFactory", () => {
  it("should create all required components when instantiated", () => {
    const { appObjects } = makeTestRig();

    // Create the factory
    const cacheAO = appObjects.getOrCreate("Cache");
    new CacheFeatureFactory(cacheAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(appObjects);
    domainFactoryRepo?.setupDomain();

    // Verify that the required AppObjects were created
    expect(appObjects.has("Cache")).toBe(true);

    // Verify that the singleton components are registered
    const cacheEntity = CacheEntity.get(appObjects);
    expect(cacheEntity).toBeDefined();

    const scriptCacheEntity = ScriptCacheEntity.get(appObjects);
    expect(scriptCacheEntity).toBeDefined();

    const assetCacheEntity = AssetCacheEntity.get(appObjects);
    expect(assetCacheEntity).toBeDefined();
  });

  it("should set up all use cases correctly", () => {
    const { appObjects } = makeTestRig();

    const cacheAO = appObjects.getOrCreate("Cache");
    new CacheFeatureFactory(cacheAO);

    // Trigger setup for all domain factories
    const domainFactoryRepo = DomainFactoryRepo.get(appObjects);
    domainFactoryRepo?.setupDomain();

    // Verify that all use cases are registered
    const getScriptFromCacheUC = GetScriptFromCacheUC.get(appObjects);
    expect(getScriptFromCacheUC).toBeDefined();

    const storeScriptInCacheUC = StoreScriptInCacheUC.get(appObjects);
    expect(storeScriptInCacheUC).toBeDefined();

    const getAssetFromCacheUC = GetAssetFromCacheUC.get(appObjects);
    expect(getAssetFromCacheUC).toBeDefined();

    const storeAssetInCacheUC = StoreAssetInCacheUC.get(appObjects);
    expect(storeAssetInCacheUC).toBeDefined();
  });

  it("should have correct factory name", () => {
    const { appObjects } = makeTestRig();

    const cacheAO = appObjects.getOrCreate("Cache");
    const factory = new CacheFeatureFactory(cacheAO);

    expect(factory.factoryName).toBe("CacheFeatureFactory");
  });
});
