/**
 * downloadAssetFile.ts
 * 
 * This controller function handles asset file download operations, triggering
 * browser downloads of asset files to the user's local system.
 * 
 * Key Concepts:
 * - Initiates browser download of asset files to user's local storage
 * - Uses DownloadAssetFileUC to handle the underlying download logic
 * - Provides error handling for missing components
 * - Works with both local and remote asset files
 * 
 * Usage Patterns:
 * - Called from UI components when users click download buttons
 * - Used in asset management workflows for file retrieval
 * - Integrated with asset viewers for quick file access
 */

import { AppObjectRepo } from "@vived/core";
import { DownloadAssetFileUC } from "../UCs/DownloadAssetFileUC";

/**
 * Initiates a download of the asset's file to the user's local system.
 * 
 * This function provides a controller-level interface for asset file downloads.
 * It triggers the browser's download mechanism to save the asset file locally,
 * handling both cached and remote file sources automatically.
 * 
 * @param assetID - The unique identifier of the asset whose file should be downloaded
 * @param appObjects - Repository for accessing asset-related app objects and components
 * @returns void - The function initiates the download but doesn't return a promise
 *                 as the download operation is handled by the browser
 */
export function downloadAssetFile(assetID: string, appObjects: AppObjectRepo) {
  const uc = DownloadAssetFileUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "deleteAsset",
      "Unable to find DownloadAssetFileUC"
    );
    return;
  }

  uc.download();
}
