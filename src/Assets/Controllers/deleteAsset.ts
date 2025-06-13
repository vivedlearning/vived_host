/**
 * deleteAsset.ts
 * 
 * This controller function handles permanent asset deletion operations with user confirmation.
 * It provides a safe interface for removing assets from the system completely, including
 * built-in confirmation dialogs to prevent accidental data loss.
 * 
 * Key Concepts:
 * - Permanent deletion removes assets completely from the system
 * - Includes confirmation prompts to prevent accidental deletions
 * - Uses DeleteAssetUC to handle the business logic and user interactions
 * - Provides error handling for missing dependencies
 * 
 * Usage Patterns:
 * - Called from UI components when users request asset deletion
 * - Used in asset management workflows for cleanup operations
 * - Integrated with confirmation dialogs for user safety
 */

import { AppObjectRepo } from "@vived/core";
import { DeleteAssetUC } from "../UCs/DeleteAssetUC";

/**
 * Initiates the deletion process for an asset with user confirmation.
 * 
 * This function provides a controller-level interface for asset deletion operations.
 * It automatically handles user confirmation prompts through the underlying use case
 * to ensure users don't accidentally delete important assets.
 * 
 * @param assetID - The unique identifier of the asset to delete
 * @param appObjects - Repository for accessing asset-related app objects and components
 * @returns void - The function initiates the deletion process but doesn't return a promise
 *                 as the confirmation dialog makes the operation inherently asynchronous
 */
export function deleteAsset(assetID: string, appObjects: AppObjectRepo) {
  const uc = DeleteAssetUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning("deleteAsset", "Unable to find DeleteAssetUC");
    return;
  }

  uc.deleteWithConfirm();
}
