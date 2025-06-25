import { AppObject, AppObjectRepo, DomainFactory } from "@vived/core";
import {
  AssetEntity,
  makeAssetEntity,
  makeAssetRepo
} from "../Entities";
import {
  makeAssetFilePM,
  makeAssetPM
} from "../PMs";
import {
  makeArchiveAssetUC,
  makeDeleteAssetUC,
  makeDownloadAssetFileUC,
  makeGetAssetBlobURLUC,
  makeGetAssetFileUC,
  makeGetAssetUC,
  makeNewAssetUC,
  makePrefetchAssets,
  makeUpdateAssetFileUC
} from "../UCs";

/**
 * Factory responsible for setting up the Assets domain components.
 * This factory initializes all entities, use cases, and presentation models
 * required for the Assets functionality.
 */
export class AssetsFactory extends DomainFactory {
  // Unique name for this factory
  readonly factoryName = "AssetsFactory";

  constructor(appObject: AppObject) {
    super(appObject);
  }

  /**
   * Sets up all entities required for the Assets system
   */
  setupEntities(): void {
    // Initialize entities
    const assetRepo = makeAssetRepo(this.appObject);
    assetRepo.assetFactory = this.makeAssetFactory();
  }

  /**
   * Creates an asset factory function that properly initializes assets with all required components
   */
  private makeAssetFactory() {
    return (id: string): AssetEntity => {
      const ao = this.appObjects.getOrCreate(id);

      // Entities
      const entity = makeAssetEntity(ao);

      // UCs for each asset
      makeArchiveAssetUC(ao);
      makeDeleteAssetUC(ao);
      makeDownloadAssetFileUC(ao);
      makeUpdateAssetFileUC(ao);

      // PMs for each asset
      makeAssetPM(ao);
      makeAssetFilePM(ao);

      return entity;
    };
  }

  /**
   * Sets up all use cases for the Assets system
   */
  setupUCs(): void {
    // Repository UCs
    makeGetAssetBlobURLUC(this.appObject);
    makeGetAssetFileUC(this.appObject);
    makeGetAssetUC(this.appObject);
    makePrefetchAssets(this.appObject);
    makeNewAssetUC(this.appObject);
  }

  /**
   * Sets up all presentation managers for the Assets system
   */
  setupPMs(): void {
    // No PMs needed for core asset functionality
  }

  /**
   * Performs any final setup operations after all components are initialized
   */
  finalSetup(): void {
    // No additional setup required for assets
  }
}
