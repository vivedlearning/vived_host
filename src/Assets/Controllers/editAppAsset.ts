/**
 * editAppAsset.ts
 *
 * This controller function initiates the asset editing workflow, transitioning
 * the application into editing mode for a specific asset.
 *
 * Key Concepts:
 * - Initiates asset editing workflows and UI state transitions
 * - Uses EditAppAssetUC to handle editing state management
 * - Provides error handling for missing components
 * - Coordinates with asset editing UI components
 *
 * Usage Patterns:
 * - Called from UI components when users click edit buttons
 * - Used in asset management workflows for content modification
 * - Integrated with asset editing dialogs and forms
 */

import { AppObjectRepo } from "@vived/core";
import { EditAppAssetUC } from "../UCs/EditAppAssetUC";

/**
 * Initiates the editing workflow for a specific asset.
 *
 * This function provides a controller-level interface for starting asset editing operations.
 * It transitions the application into editing mode for the specified asset, typically
 * opening editing dialogs or forms where users can modify asset properties.
 *
 * @param assetID - The unique identifier of the asset to edit
 * @param appObjects - Repository for accessing asset-related app objects and components
 * @returns void - The function initiates the editing workflow but doesn't return a promise
 *                 as the editing process is managed through UI state changes
 */
export function editAppAsset(assetID: string, appObjects: AppObjectRepo) {
  const uc = EditAppAssetUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("editAppAsset", "Unable to find EditAppAssetUC");
    return;
  }

  uc.editAsset(assetID);
}
