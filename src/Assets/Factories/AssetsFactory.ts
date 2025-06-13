import { AppObject, AppObjectRepo } from "@vived/core";
import {
  AssetEntity,
  makeAppAssets,
  makeAssetEntity,
  makeAssetRepo
} from "../Entities";
import {
  makeAppAssetListPM,
  makeAssetFilePM,
  makeAssetPM,
  makeEditingAppAssetPM,
  makeShowArchivedAppAssetPM
} from "../PMs";
import {
  makeArchiveAssetUC,
  makeDeleteAssetUC,
  makeDownloadAssetFileUC,
  makeEditAppAsset,
  makeGetAppAssetUC,
  makeGetAssetBlobURLUC,
  makeGetAssetFileUC,
  makeGetAssetUC,
  makeNewAppAssetUC,
  makeNewAssetUC,
  makePrefetchAssets,
  makeUpdateAppAssetMetaUC,
  makeUpdateAssetFileUC
} from "../UCs";

/**
 * Factory responsible for setting up the Assets domain components.
 * This factory initializes all entities, use cases, and presentation models
 * required for the Assets functionality.
 */
export class AssetsFactory {
  // Unique name for this factory
  readonly factoryName = "AssetsFactory";
  
  // Store references to key AppObjects needed across setup phases
  private assetRepoAO!: AppObject;
  private appAssetsAO!: AppObject;
  private assetRepo: any; // This will hold the asset repository
  
  constructor(private appObjects: AppObjectRepo) {
    // Initialize in the proper order
    this.setupEntities();
    this.setupUCs();
    this.setupPMs();
    this.finalSetup();
  }

  /**
   * Sets up all entities required for the Assets system
   */
  setupEntities(): void {
    this.assetRepoAO = this.appObjects.getOrCreate("Asset Repository");
    this.appAssetsAO = this.appObjects.getOrCreate("App Assets");

    // Initialize entities
    this.assetRepo = makeAssetRepo(this.assetRepoAO);
    this.assetRepo.assetFactory = this.makeAssetFactory();
    makeAppAssets(this.appAssetsAO);
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
      makeUpdateAppAssetMetaUC(ao);

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
    makeEditAppAsset(this.assetRepoAO);
    makeGetAssetBlobURLUC(this.assetRepoAO);
    makeGetAssetFileUC(this.assetRepoAO);
    makeGetAssetUC(this.assetRepoAO);
    makePrefetchAssets(this.assetRepoAO);
    makeNewAssetUC(this.assetRepoAO);
    
    // App Assets UCs
    makeNewAppAssetUC(this.appAssetsAO);
    makeGetAppAssetUC(this.appAssetsAO);
  }

  /**
   * Sets up all presentation managers for the Assets system
   */
  setupPMs(): void {
    // App Assets PMs
    makeAppAssetListPM(this.appAssetsAO);
    makeShowArchivedAppAssetPM(this.appAssetsAO);
    makeEditingAppAssetPM(this.appAssetsAO);
  }

  /**
   * Performs any final setup operations after all components are initialized
   */
  finalSetup(): void {
    // No additional setup required for assets
  }
}