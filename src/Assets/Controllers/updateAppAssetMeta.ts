/**
 * updateAppAssetMeta.ts
 * 
 * This controller function handles updating asset metadata (name, description, etc.)
 * for existing assets. It provides a streamlined interface for modifying asset
 * information without affecting the actual asset files.
 * 
 * Key Concepts:
 * - Updates asset metadata without modifying the actual file content
 * - Uses UpdateAppAssetMetaUC to handle validation and persistence
 * - Provides error handling for missing components
 * - Supports partial updates of asset information
 * 
 * Usage Patterns:
 * - Called from asset editing forms and dialogs
 * - Used in asset management workflows for information updates
 * - Integrated with asset detail views and editing interfaces
 */

import { AppObjectRepo } from "@vived/core";
import {
  UpdateAppAssetMetaUC,
  UpdateAppAssetMetaDTO
} from "../UCs/UpdateAppAssetMetaUC";

/**
 * Updates the metadata of an existing asset.
 * 
 * This function provides a controller-level interface for updating asset metadata
 * such as name, description, and other properties. It handles validation and
 * persistence of the changes through the underlying use case.
 * 
 * @param data - Data transfer object containing the metadata fields to update
 * @param assetID - The unique identifier of the asset to update
 * @param appObjects - Repository for accessing asset-related app objects and components
 * @returns void - The function operates synchronously and triggers immediate updates
 */
export function updateAppAssetMeta(
  data: UpdateAppAssetMetaDTO,
  assetID: string,
  appObjects: AppObjectRepo
) {
  const uc = UpdateAppAssetMetaUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "updateAppAssetMeta",
      "Unable to find UpdateAssetMetaUC"
    );
    return;
  }

  uc.updateMeta(data);
}
