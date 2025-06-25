/**
 * getAssetFile.ts
 *
 * This controller function retrieves an asset file as a File object,
 * handling caching and error management for file access operations.
 *
 * Key Concepts:
 * - Retrieves asset files as File objects for download or processing
 * - Uses GetAssetFileUC to handle caching and file retrieval logic
 * - Provides error handling for missing components
 * - Coordinates with asset file management workflows
 *
 * Usage Patterns:
 * - Called from UI components when users need asset file access
 * - Used in asset management workflows for file processing
 * - Integrated with download and preview functionality
 */

import { AppObjectRepo } from "@vived/core";
import { GetAssetFileUC } from "../UCs/GetAssetFileUC";

/**
 * Retrieves an asset file as a File object.
 *
 * This function provides a controller-level interface for asset file retrieval.
 * It handles the complete file access workflow including caching optimization,
 * error handling, and returns a File object ready for use in web applications.
 *
 * @param assetID - The unique identifier of the asset whose file should be retrieved
 * @param appObjects - Repository for accessing asset-related app objects and components
 * @returns Promise<File> - A promise that resolves to the File object for the asset,
 *                         or undefined if the operation cannot be completed
 */
export function getAssetFile(
  assetID: string,
  appObjects: AppObjectRepo
): Promise<File> | undefined {
  const uc = GetAssetFileUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("getAssetFile", "Unable to find GetAssetFileUC");
    return;
  }

  return uc.getAssetFile(assetID);
}
