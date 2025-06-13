/**
 * DeleteAssetUC.ts
 * 
 * This use case handles the permanent deletion of assets from the system,
 * including user confirmation dialogs and cleanup of all related data.
 * 
 * Key Concepts:
 * - Permanent deletion removes assets completely from the system
 * - Includes mandatory user confirmation to prevent accidental deletions
 * - Cleans up asset from all collections and repositories
 * - Uses API calls to persist deletion on the backend
 * - Provides user feedback through dialogs during the operation
 * 
 * Usage Patterns:
 * - Created per-asset during factory setup
 * - Accessed through static get() method with asset ID
 * - Provides both confirmed and unconfirmed deletion methods
 * - Handles async operations with proper error handling and user feedback
 */

import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import {
  DialogAlertDTO,
  MakeAlertDialogUC,
  MakeConfirmDialogUC,
  MakeSpinnerDialogUC
} from "../../Dialog";
import { DeleteAssetOnAPIUC } from "../../VivedAPI";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";
import { AssetEntity } from "../Entities/AssetEntity";
import { AssetRepo } from "../Entities/AssetRepo";

/**
 * DeleteAssetUC manages the permanent deletion of individual assets.
 * 
 * This use case provides both confirmed and unconfirmed deletion methods,
 * handling complete cleanup of asset data from all system components.
 */
export abstract class DeleteAssetUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "DeleteAssetUC";

  /**
   * Permanently deletes the associated asset without user confirmation.
   * 
   * @returns Promise that resolves when the deletion completes successfully
   */
  abstract delete(): Promise<void>;

  /**
   * Initiates asset deletion with user confirmation dialog.
   * Shows a confirmation dialog before proceeding with the deletion.
   */
  abstract deleteWithConfirm(): void;

  /**
   * Retrieves a DeleteAssetUC component for a specific asset.
   * 
   * @param assetID - The unique identifier of the asset
   * @param appObjects - Repository for accessing app objects and components
   * @returns DeleteAssetUC instance or undefined if not found
   */
  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): DeleteAssetUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "DeleteAssetUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<DeleteAssetUC>(DeleteAssetUC.type);
    if (!uc) {
      appObjects.submitWarning(
        "DeleteAssetUC.get",
        "App Object does not have DeleteAssetUC"
      );
      return undefined;
    }

    return uc;
  }
}

/**
 * Factory function to create a new DeleteAssetUC instance.
 * 
 * @param appObject - The AppObject that will host this use case (should contain an AssetEntity)
 * @returns A new DeleteAssetUC implementation instance
 */
export function makeDeleteAssetUC(appObject: AppObject): DeleteAssetUC {
  return new DeleteAssetUCImp(appObject);
}

/**
 * Private implementation of DeleteAssetUC that handles the concrete deletion operations.
 * 
 * Key Implementation Details:
 * - Validates asset entity existence before operations
 * - Uses DeleteAssetOnAPIUC for backend persistence
 * - Provides user confirmation through dialog system
 * - Shows spinner dialogs during deletion operations
 * - Handles errors gracefully with alert dialogs and logging
 * - Cleans up asset from all collections and repositories
 * - Removes asset from both AppAssetsEntity and AssetRepo
 */
class DeleteAssetUCImp extends DeleteAssetUC {
  /** The asset entity this use case operates on */
  private asset?: AssetEntity;

  /** 
   * Gets the API use case for deleting assets from the backend
   * Cached for efficient repeated access during operations
   */
  private get doDelete() {
    return this.getCachedSingleton<DeleteAssetOnAPIUC>(DeleteAssetOnAPIUC.type)
      ?.doDelete;
  }

  /** 
   * Gets the app assets collection entity for cleanup operations
   * Used to remove the asset from collection displays
   */
  private get appAssets() {
    return this.getCachedSingleton<AppAssetsEntity>(AppAssetsEntity.type);
  }

  /** 
   * Gets the asset repository for cleanup operations
   * Used to remove the asset from the global asset repository
   */
  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  /**
   * Initiates asset deletion with user confirmation.
   * 
   * Shows a confirmation dialog with warnings about the irreversible nature
   * of the operation and suggests archiving as an alternative.
   */
  deleteWithConfirm = () => {
    MakeConfirmDialogUC.make(
      {
        cancelButtonLabel: "Cancel",
        confirmButtonLabel: "Delete Asset",
        message:
          "Are you sure you want to delete this asset. This cannot be undone and could affect users. Consider archiving it instead",
        title: "Delete Asset",
        onConfirm: this.delete
      },
      this.appObjects
    );
  };

  /**
   * Permanently deletes the asset with full cleanup and user feedback.
   * 
   * This method handles the complete deletion workflow:
   * 1. Validates the asset exists
   * 2. Shows a spinner dialog during the API operation
   * 3. Removes the asset from backend via API
   * 4. Cleans up the asset from all local collections and repositories
   * 5. Shows error dialogs and logs failures appropriately
   * 
   * @returns Promise that resolves when the operation completes (successfully or with handled error)
   */
  delete = (): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    const doDelete = this.doDelete;
    if (!doDelete) {
      return Promise.reject();
    }

    // Show user feedback during operation
    const title = "Delete Asset";
    const spinnerDialog = MakeSpinnerDialogUC.make(
      {
        title,
        message: "Deleting asset..."
      },
      this.appObjects
    );

    return new Promise((resolve) => {
      doDelete(asset.id)
        .then(() => {
          // Clean up from all collections and repositories
          if (this.appAssets && this.appAssets.has(asset.id)) {
            this.appAssets.remove(asset.id);
          }

          if (this.assetRepo && this.assetRepo.has(asset.id)) {
            this.assetRepo.remove(asset.id);
          }

          spinnerDialog?.close();
          resolve();
        })
        .catch((e) => {
          // Handle errors with user feedback
          this.error("Archive asset error: " + e.message);
          spinnerDialog?.close();
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
   * Initializes the DeleteAssetUC with validation of required components.
   * 
   * @param appObject - The AppObject that should contain the AssetEntity this UC will operate on
   */
  constructor(appObject: AppObject) {
    super(appObject, DeleteAssetUC.type);

    this.asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!this.asset) {
      this.error(
        "UC has been added to an App Object that does not have ArchiveAssetUC"
      );
    }
  }
}
