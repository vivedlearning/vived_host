/**
 * setupVivedAPIForSandbox.ts
 * 
 * This file defines the factory function for setting up the complete VivedAPI feature
 * in a sandbox environment. It initializes all necessary components including entities,
 * use cases, and presentation managers required for API communication.
 * 
 * Key concepts:
 * - Factory function creates and wires up all VivedAPI components
 * - Creates a dedicated AppObject for organizing API-related components
 * - Initializes singleton entities for API configuration management
 * - Sets up all use cases for various API operations (assets, apps, auth)
 * - Establishes presentation managers for UI integration
 * - Provides a single entry point for complete feature setup
 * 
 * Usage pattern:
 * 1. Call setupVivedAPIForSandbox with AppObjectRepo during initialization
 * 2. Function creates all necessary components and registers them
 * 3. Components become available through standard AppObject retrieval methods
 * 4. Use in sandbox environments for development and testing
 */

import { AppObjectRepo } from "@vived/core";
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
 * Sets up the complete VivedAPI feature for sandbox environments
 * @param appObjects The AppObjectRepo to register all VivedAPI components in
 */
export function setupVivedAPIForSandbox(appObjects: AppObjectRepo) {
  const ao = appObjects.getOrCreate("VIVED API");

  // Entities
  new VivedAPIEntity(ao);

  // UCs
  makeDeleteAssetOnAPIUC(ao);
  makeFetchAssetFileFromAPIUC(ao);
  makeFetchAssetMetaFromAPIUC(ao);
  makeFileUploadUC(ao);
  makeGetAppFromAPIUC(ao);
  makeGetAssetsForOwnerFromAPIUC(ao);
  makePatchAssetFileUC(ao);
  makePatchAssetIsArchivedUC(ao);
  makePatchAssetMetaUC(ao);
  makePatchAssetUC(ao);
  makePostNewAssetUC(ao);

  // PMs
  makeUserTokenPM(ao);
}
