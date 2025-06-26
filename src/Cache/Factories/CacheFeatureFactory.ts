import { AppObject, DomainFactory } from "@vived/core";
import { makeAssetCacheEntity, makeScriptCacheEntity } from "../Entities";
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

  constructor(appObject: AppObject) {
    super(appObject);
  }

  /**
   * Sets up all entities required for the Cache system
   */
  setupEntities(): void {
    // Initialize entities
    makeScriptCacheEntity(this.appObject);
    makeAssetCacheEntity(this.appObject);
  }

  /**
   * Sets up all use cases for the Cache system
   */
  setupUCs(): void {
    // Cache use cases
    makeGetScriptFromCacheUC(this.appObject);
    makeStoreScriptInCacheUC(this.appObject);
    makeGetAssetFromCacheUC(this.appObject);
    makeStoreAssetInCacheUC(this.appObject);
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
