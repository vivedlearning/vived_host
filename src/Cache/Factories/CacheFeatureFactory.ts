import { AppObject, DomainFactory } from "@vived/core";
import {
  makeCacheEntity,
  makeAssetCacheEntity,
  makeScriptCacheEntity
} from "../Entities";
import {
  makeGetAssetFromCacheUC,
  makeGetScriptFromCacheUC,
  makeStoreAssetInCacheUC,
  makeStoreScriptInCacheUC
} from "../UCs";

/**
 * Factory responsible for setting up the Cache domain components.
 * This factory initializes all entities, use cases, and presentation models
 * required for the Cache functionality.
 */
export class CacheFeatureFactory extends DomainFactory {
  // Unique name for this factory
  readonly factoryName = "CacheFeatureFactory";

  // Store references to key AppObjects needed across setup phases
  private cacheEntityAO!: AppObject;

  constructor(appObject: AppObject) {
    super(appObject);
  }

  /**
   * Sets up all entities required for the Cache system
   */
  setupEntities(): void {
    this.cacheEntityAO = this.appObjects.getOrCreate("Cache");

    // Initialize entities
    makeCacheEntity(this.cacheEntityAO);
    makeScriptCacheEntity(this.cacheEntityAO);
    makeAssetCacheEntity(this.cacheEntityAO);
  }

  /**
   * Sets up all use cases for the Cache system
   */
  setupUCs(): void {
    // Cache use cases
    makeGetScriptFromCacheUC(this.cacheEntityAO);
    makeStoreScriptInCacheUC(this.cacheEntityAO);
    makeGetAssetFromCacheUC(this.cacheEntityAO);
    makeStoreAssetInCacheUC(this.cacheEntityAO);
  }

  /**
   * Sets up all presentation managers for the Cache system
   */
  setupPMs(): void {
    // No presentation managers exist for the Cache system
  }

  /**
   * Performs any final setup operations after all components are initialized
   */
  finalSetup(): void {
    // No additional setup required for cache
  }
}
