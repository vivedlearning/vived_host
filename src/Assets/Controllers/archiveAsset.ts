/**
 * archiveAsset.ts
 *
 * This controller function handles archiving and unarchiving asset operations.
 * It provides a simple interface for managing asset visibility without permanently
 * deleting them from the system.
 *
 * Key Concepts:
 * - Archive operations are reversible soft-deletion mechanisms
 * - Archived assets are hidden from normal views but remain in the system
 * - Uses the ArchiveAssetUC to perform the actual business logic
 * - Provides error handling and validation for missing dependencies
 *
 * Usage Patterns:
 * - Called from UI components when users archive/unarchive assets
 * - Used by bulk operations for managing multiple assets
 * - Integrated with asset management workflows for organizational purposes
 */

import { AppObjectRepo } from "@vived/core";
import { ArchiveAssetUC } from "../UCs/ArchiveAssetUC";

/**
 * Archives or unarchives an asset, making it hidden or visible in asset lists.
 *
 * This function provides a controller-level interface for asset archival operations,
 * abstracting the underlying use case logic and providing consistent error handling.
 *
 * @param assetID - The unique identifier of the asset to archive/unarchive
 * @param archive - True to archive the asset (hide it), false to unarchive (show it)
 * @param appObjects - Repository for accessing asset-related app objects and components
 * @returns Promise that resolves when the operation completes successfully
 * @throws Promise rejection if the ArchiveAssetUC component cannot be found
 */
export function archiveAsset(
  assetID: string,
  archive: boolean,
  appObjects: AppObjectRepo
): Promise<void> {
  const uc = ArchiveAssetUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning("archiveAsset", "Unable to find ArchiveAssetUC");
    return Promise.reject();
  }

  return uc.setArchived(archive);
}
