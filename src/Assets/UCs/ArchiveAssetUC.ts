/**
 * ArchiveAssetUC.ts
 *
 * This use case handles the archiving and unarchiving of assets, providing
 * a reversible soft-deletion mechanism that hides assets from normal views
 * while preserving them in the system.
 *
 * Key Concepts:
 * - Archive operations are reversible soft-deletion mechanisms
 * - Archived assets remain in the system but are hidden from normal views
 * - Uses API calls to persist archive state changes
 * - Provides user feedback through spinner and error dialogs
 * - Updates both local entity state and collection notifications
 *
 * Usage Patterns:
 * - Created per-asset during factory setup
 * - Accessed through static get() method with asset ID
 * - Handles both archiving (hiding) and unarchiving (showing) operations
 * - Manages async API calls with proper error handling and user feedback
 */

import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import {
  DialogAlertDTO,
  MakeAlertDialogUC,
  MakeSpinnerDialogUC
} from "../../Dialog";
import { PatchAssetIsArchivedUC } from "../../VivedAPI";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";
import { AssetEntity } from "../Entities/AssetEntity";

/**
 * ArchiveAssetUC manages the archiving and unarchiving operations for individual assets.
 *
 * This use case provides the business logic for toggling asset archive status,
 * handling API persistence, and managing user feedback during the operation.
 * Archive operations are reversible and provide a soft-deletion mechanism.
 */
export abstract class ArchiveAssetUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "ArchiveAssetUC";

  /**
   * Sets the archived status of the associated asset.
   *
   * @param archived - True to archive (hide) the asset, false to unarchive (show) it
   * @returns Promise that resolves when the operation completes successfully
   */
  abstract setArchived(archived: boolean): Promise<void>;

  /**
   * Retrieves an ArchiveAssetUC component for a specific asset.
   *
   * @param assetID - The unique identifier of the asset
   * @param appObjects - Repository for accessing app objects and components
   * @returns ArchiveAssetUC instance or undefined if not found
   */
  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): ArchiveAssetUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "ArchiveAssetUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<ArchiveAssetUC>(ArchiveAssetUC.type);
    if (!uc) {
      appObjects.submitWarning(
        "ArchiveAssetUC.get",
        "App Object does not have ArchiveAssetUC"
      );
      return undefined;
    }

    return uc;
  }
}

/**
 * Factory function to create a new ArchiveAssetUC instance.
 *
 * @param appObject - The AppObject that will host this use case (should contain an AssetEntity)
 * @returns A new ArchiveAssetUC implementation instance
 */
export function makeArchiveAssetUC(appObject: AppObject): ArchiveAssetUC {
  return new ArchiveAssetUCImp(appObject);
}

/**
 * Private implementation of ArchiveAssetUC that handles the concrete archive operations.
 *
 * Key Implementation Details:
 * - Validates asset entity existence and current archive state
 * - Uses PatchAssetIsArchivedUC for API persistence
 * - Provides user feedback through spinner dialogs during operations
 * - Handles errors gracefully with alert dialogs and logging
 * - Updates local asset state and triggers collection change notifications
 * - Prevents redundant operations when archive state hasn't changed
 */
class ArchiveAssetUCImp extends ArchiveAssetUC {
  /** The asset entity this use case operates on */
  private asset?: AssetEntity;

  /**
   * Gets the API use case for patching asset archive status
   * Cached for efficient repeated access during operations
   */
  private get patchAssetIsArchived() {
    return this.getCachedSingleton<PatchAssetIsArchivedUC>(
      PatchAssetIsArchivedUC.type
    )?.doPatch;
  }

  /**
   * Gets the app assets collection entity for triggering collection updates
   * Used to notify UI components when asset visibility changes
   */
  private get appAssets() {
    return this.getCachedSingleton<AppAssetsEntity>(AppAssetsEntity.type);
  }

  /**
   * Sets the archived status of the asset with full error handling and user feedback.
   *
   * This method handles the complete archive workflow:
   * 1. Validates the asset exists and state change is needed
   * 2. Shows a spinner dialog during the API operation
   * 3. Updates the asset entity and collection on success
   * 4. Shows error dialogs and logs failures appropriately
   *
   * @param archived - True to archive the asset, false to unarchive it
   * @returns Promise that resolves when the operation completes (successfully or with handled error)
   */
  setArchived = (archived: boolean): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    // Prevent redundant operations
    if (asset.archived === archived) {
      return Promise.resolve();
    }

    const patchAssetIsArchived = this.patchAssetIsArchived;
    if (!patchAssetIsArchived) {
      return Promise.reject();
    }

    // Show user feedback during operation
    const title = archived ? "Archiving Asset" : "Unarchive Asset";
    const spinner = MakeSpinnerDialogUC.make(
      {
        title,
        message: "Updating asset's archived flag..."
      },
      this.appObjects
    );

    return new Promise((resolve, reject) => {
      patchAssetIsArchived(asset.id, archived)
        .then(() => {
          // Update local state
          asset.archived = archived;

          // Notify collections if this asset is part of them
          if (this.appAssets && this.appAssets.has(asset.id)) {
            this.appAssets.notifyOnChange();
          }
          spinner?.close();
          resolve();
        })
        .catch((e) => {
          // Handle errors with user feedback
          this.error("Archive asset error: " + e.message);
          spinner?.close();
          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when setting the asset's archived flag. Check the console. ${e.message}`,
            title: "Archive Asset Error"
          };

          MakeAlertDialogUC.make(dialogDTO, this.appObjects);
          resolve(); // Resolve to prevent unhandled rejections, error is already handled
        });
    });
  };

  /**
   * Initializes the ArchiveAssetUC with validation of required components.
   *
   * @param appObject - The AppObject that should contain the AssetEntity this UC will operate on
   */
  constructor(appObject: AppObject) {
    super(appObject, ArchiveAssetUC.type);

    this.asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!this.asset) {
      this.error(
        "UC has been added to an App Object that does not have ArchiveAssetUC"
      );
    }
  }
}
