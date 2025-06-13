/**
 * newAppAsset.ts
 * 
 * This controller function handles the creation of new assets within the context
 * of a specific application. It provides a streamlined interface for adding
 * new assets to an application's asset collection.
 * 
 * Key Concepts:
 * - Creates new assets and associates them with specific applications
 * - Uses NewAppAssetUC to handle the creation logic and API interactions
 * - Provides error handling for missing components
 * - Returns promises for async operation handling
 * 
 * Usage Patterns:
 * - Called from UI components when users upload new assets
 * - Used in asset creation workflows and dialogs
 * - Integrated with file upload mechanisms and asset forms
 */

import { AppObjectRepo } from "@vived/core";
import { NewAppAssetDTO, NewAppAssetUC } from "../UCs/NewAppAssetUC";

/**
 * Creates a new asset associated with a specific application.
 * 
 * This function provides a controller-level interface for creating new application assets.
 * It handles the complete asset creation workflow, including file upload, metadata storage,
 * and integration with the application's asset collection.
 * 
 * @param data - Data transfer object containing all necessary information for asset creation
 * @param appObjects - Repository for accessing asset-related app objects and components
 * @returns Promise that resolves when the asset is successfully created
 * @throws Promise rejection if the NewAppAssetUC component cannot be found
 */
export function newAppAsset(
  data: NewAppAssetDTO,
  appObjects: AppObjectRepo
): Promise<void> {
  const uc = NewAppAssetUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("newAppAsset", "Unable to find NewAppAssetUC");
    return Promise.reject();
  }

  return uc.create(data);
}
