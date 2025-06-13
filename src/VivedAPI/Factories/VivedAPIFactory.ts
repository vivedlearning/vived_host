import { AppObject, AppObjectRepo, DomainFactory } from "@vived/core";
import { VivedAPIEntity } from "../Entities";
import { makeUserTokenPM } from "../PMs";
import {
  makeDeleteAssetOnAPIUC,
  makeFetchAssetFileFromAPIUC,
  makeFetchAssetMetaFromAPIUC,
  makeFileUploadUC,
  makeGetAppFromAPIUC,
  makeGetAssetsForOwnerFromAPIUC,
  makePatchAssetFileUC,
  makePatchAssetIsArchivedUC,
  makePatchAssetMetaUC,
  makePatchAssetUC,
  makePostNewAssetUC
} from "../UCs";

/**
 * Factory responsible for setting up the VIVED API domain components.
 * This factory initializes all entities, use cases, and presentation models
 * required for the VIVED API functionality.
 */
export class VivedAPIFactory extends DomainFactory {
  // Unique name for this factory
  readonly factoryName = "VivedAPIFactory";
  
  // Store reference to the VIVED API AppObject
  private vivedAPIAO!: AppObject;

  constructor(appObjects: AppObjectRepo) {
    // DomainFactory expects an AppObject, so we need to create one for this factory
    const factoryAO = appObjects.getOrCreate("VivedAPIFactory");
    super(factoryAO);
    
    // Initialize in the proper order
    this.setupEntities();
    this.setupUCs();
    this.setupPMs();
    this.finalSetup();
  }

  /**
   * Sets up all entities required for the VIVED API system
   */
  setupEntities(): void {
    this.vivedAPIAO = this.appObjects.getOrCreate("VIVED API");

    // Initialize entities
    new VivedAPIEntity(this.vivedAPIAO);
  }

  /**
   * Sets up all use cases for the VIVED API system
   */
  setupUCs(): void {
    makeDeleteAssetOnAPIUC(this.vivedAPIAO);
    makeFetchAssetFileFromAPIUC(this.vivedAPIAO);
    makeFetchAssetMetaFromAPIUC(this.vivedAPIAO);
    makeFileUploadUC(this.vivedAPIAO);
    makeGetAppFromAPIUC(this.vivedAPIAO);
    makeGetAssetsForOwnerFromAPIUC(this.vivedAPIAO);
    makePatchAssetFileUC(this.vivedAPIAO);
    makePatchAssetIsArchivedUC(this.vivedAPIAO);
    makePatchAssetMetaUC(this.vivedAPIAO);
    makePatchAssetUC(this.vivedAPIAO);
    makePostNewAssetUC(this.vivedAPIAO);
  }

  /**
   * Sets up all presentation managers for the VIVED API system
   */
  setupPMs(): void {
    makeUserTokenPM(this.vivedAPIAO);
  }

  /**
   * Performs any final setup operations after all components are initialized
   */
  finalSetup(): void {
    // No additional setup required for VIVED API
  }
}
