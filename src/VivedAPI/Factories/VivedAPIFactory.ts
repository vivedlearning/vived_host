import { DomainFactory } from "@vived/core";
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
 *
 * This factory initializes all entities, use cases, and presentation models
 * required for the VIVED API functionality. It follows the domain-driven
 * design pattern by organizing components into their respective layers.
 *
 * @extends DomainFactory
 */
export class VivedAPIFactory extends DomainFactory {
  factoryName = "VivedAPIFactory";

  /**
   * Sets up all entities required for the VIVED API system.
   *
   * Initializes singleton entities that maintain the state and business
   * logic for the VIVED API functionality.
   */
  setupEntities(): void {
    new VivedAPIEntity(this.appObject);
  }

  /**
   * Sets up all use cases for the VIVED API system.
   *
   * Initializes use cases that define the business operations and
   * workflows available in the VIVED API.
   */
  setupUCs(): void {
    makeDeleteAssetOnAPIUC(this.appObject);
    makeFetchAssetFileFromAPIUC(this.appObject);
    makeFetchAssetMetaFromAPIUC(this.appObject);
    makeFileUploadUC(this.appObject);
    makeGetAppFromAPIUC(this.appObject);
    makeGetAssetsForOwnerFromAPIUC(this.appObject);
    makePatchAssetFileUC(this.appObject);
    makePatchAssetIsArchivedUC(this.appObject);
    makePatchAssetMetaUC(this.appObject);
    makePatchAssetUC(this.appObject);
    makePostNewAssetUC(this.appObject);
  }

  /**
   * Sets up all presentation managers for the VIVED API system.
   *
   * Initializes presentation managers that handle the view logic and
   * state management for UI components related to the VIVED API.
   */
  setupPMs(): void {
    makeUserTokenPM(this.appObject);
  }

  /**
   * Performs any final setup operations after all components are initialized.
   *
   * This method is called after entities, use cases, and presentation models
   * have been set up. Currently no additional setup is required for the VIVED API.
   */
  finalSetup(): void {
    // No additional setup required for VIVED API
  }
}
