/**
 * getAppAssets.ts
 * 
 * This controller function initiates the retrieval of assets associated with a specific application.
 * It triggers the loading and display of all assets that belong to or are used by a particular app.
 * 
 * Key Concepts:
 * - Retrieves and loads assets associated with a specific application
 * - Uses GetAppAssetsUC to handle the asset fetching and filtering logic
 * - Provides error handling for missing components
 * - Updates asset collections and UI displays automatically
 * 
 * Usage Patterns:
 * - Called when loading an application's asset workspace
 * - Used in asset management interfaces to filter by application
 * - Integrated with application switching workflows
 */

import { AppObjectRepo } from "@vived/core";
import { GetAppAssetsUC } from "../UCs/GetAppAssetsUC";

/**
 * Retrieves and loads all assets associated with a specific application.
 * 
 * This function provides a controller-level interface for fetching application-specific assets.
 * It triggers the loading of all assets that belong to or are used by the specified application,
 * updating asset collections and UI displays accordingly.
 * 
 * @param appID - The unique identifier of the application whose assets should be retrieved
 * @param appObjects - Repository for accessing asset-related app objects and components
 * @returns void - The function initiates the asset retrieval but doesn't return a promise
 *                 as the loading process is managed through UI state updates
 */
export function getAppAssets(appID: string, appObjects: AppObjectRepo) {
  const uc = GetAppAssetsUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("getAppAssets", "Unable to find GetAppAssetsUC");
    return;
  }

  uc.getAppAssets(appID);
}
