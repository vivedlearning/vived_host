/**
 * updateAssetFile.ts
 *
 * This controller function handles updating the actual file content of existing assets.
 * It provides a streamlined interface for replacing asset files while preserving
 * the asset's metadata and relationships.
 *
 * Key Concepts:
 * - Updates the actual file content of existing assets
 * - Preserves asset metadata and relationships during file replacement
 * - Uses UpdateAssetFileUC to handle file upload and persistence
 * - Provides error handling for missing components
 *
 * Usage Patterns:
 * - Called from file upload interfaces when users replace asset files
 * - Used in asset management workflows for content updates
 * - Integrated with drag-and-drop file replacement interfaces
 */

import { AppObjectRepo } from "@vived/core";
import { UpdateAssetFileUC } from "../UCs/UpdateAssetFileUC";

/**
 * Updates the file content of an existing asset.
 *
 * This function provides a controller-level interface for replacing the file
 * associated with an existing asset. It handles the upload and storage of the
 * new file while preserving all asset metadata and relationships.
 *
 * @param file - The new file object to replace the existing asset file
 * @param assetID - The unique identifier of the asset whose file should be updated
 * @param appObjects - Repository for accessing asset-related app objects and components
 * @returns void - The function initiates the file update process asynchronously
 */
export function updateAssetFile(
  file: File,
  assetID: string,
  appObjects: AppObjectRepo
) {
  const uc = UpdateAssetFileUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "updateAssetFile",
      "Unable to find UpdateAssetFileUC"
    );
    return;
  }

  uc.updateFile(file);
}
