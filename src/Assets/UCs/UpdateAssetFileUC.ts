/**
 * UpdateAssetFileUC.ts
 *
 * This use case handles updating the file content of existing assets while
 * preserving metadata and relationships. It provides a complete workflow
 * for replacing asset files with user feedback and error handling.
 *
 * Key Concepts:
 * - Updates asset file content while preserving metadata and relationships
 * - Uses API calls to persist file changes on the backend
 * - Provides user feedback through spinner and error dialogs
 * - Manages local asset state updates after successful operations
 * - Handles filename updates from backend processing
 *
 * Usage Patterns:
 * - Created per-asset during factory setup
 * - Accessed through static get() method with asset ID
 * - Called with new File object to replace existing asset content
 * - Handles async operations with proper error handling and user feedback
 */

import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import {
  DialogAlertDTO,
  DialogQueue,
  MakeAlertDialogUC,
  MakeSpinnerDialogUC
} from "../../Dialog";
import { PatchAssetFileUC } from "../../VivedAPI";
import { AssetEntity } from "../Entities/AssetEntity";

/**
 * Data transfer object for asset metadata updates.
 * Contains the basic metadata fields that can be modified for an asset.
 */
export interface UpdateAssetMetaDTO {
  /** Display name for the asset */
  name: string;
  /** Detailed description of the asset's purpose or content */
  description: string;
  /** Whether the asset should be archived (hidden from normal views) */
  archived: boolean;
}

/**
 * UpdateAssetFileUC manages updating the file content of individual assets.
 *
 * This use case provides the business logic for replacing asset files,
 * handling API persistence, and managing user feedback during the operation.
 */
export abstract class UpdateAssetFileUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "UpdateAssetFileUC";

  /**
   * Updates the file content of the associated asset.
   *
   * @param file - The new file to replace the existing asset content
   * @returns Promise that resolves when the operation completes successfully
   */
  abstract updateFile(file: File): Promise<void>;

  /**
   * Retrieves an UpdateAssetFileUC component for a specific asset.
   *
   * @param assetID - The unique identifier of the asset
   * @param appObjects - Repository for accessing app objects and components
   * @returns UpdateAssetFileUC instance or undefined if not found
   */
  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): UpdateAssetFileUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "UpdateAssetFileUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<UpdateAssetFileUC>(
      UpdateAssetFileUC.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "UpdateAssetFileUC.get",
        "App Object does not have UpdateAssetFileUC"
      );
      return undefined;
    }

    return uc;
  }
}

/**
 * Factory function to create a new UpdateAssetFileUC instance.
 *
 * @param appObject - The AppObject that will host this use case (should contain an AssetEntity)
 * @returns A new UpdateAssetFileUC implementation instance
 */
export function makeUpdateAssetFileUC(appObject: AppObject): UpdateAssetFileUC {
  return new UpdateAssetFileUCImp(appObject);
}

/**
 * Private implementation of UpdateAssetFileUC that handles the concrete file update operations.
 *
 * Key Implementation Details:
 * - Validates asset entity existence before operations
 * - Uses PatchAssetFileUC for backend API persistence
 * - Shows spinner dialogs during file upload operations
 * - Handles errors gracefully with alert dialogs and logging
 * - Updates local asset state including file content and filename
 * - Preserves asset metadata and relationships during file replacement
 */
class UpdateAssetFileUCImp extends UpdateAssetFileUC {
  /** The asset entity this use case operates on */
  private asset?: AssetEntity;

  /**
   * Gets the API use case for patching asset files on the backend
   * Cached for efficient repeated access during operations
   */
  private get patchAssetFile() {
    return this.getCachedSingleton<PatchAssetFileUC>(PatchAssetFileUC.type)
      ?.doPatch;
  }

  /**
   * Updates the asset file with full error handling and user feedback.
   *
   * This method handles the complete file update workflow:
   * 1. Validates the asset exists
   * 2. Shows a spinner dialog during the API operation
   * 3. Uploads the new file to the backend via API
   * 4. Updates the local asset with the new file and filename
   * 5. Shows error dialogs and logs failures appropriately
   *
   * @param file - The new file to replace the existing asset content
   * @returns Promise that resolves when the operation completes (successfully or with handled error)
   */
  updateFile = (file: File): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    const patchAssetFile = this.patchAssetFile;
    if (!patchAssetFile) {
      return Promise.reject();
    }

    // Show user feedback during operation
    const spinnerDialog = MakeSpinnerDialogUC.make(
      {
        title: "Asset File",
        message: "Updating asset's file..."
      },
      this.appObjects
    );

    return new Promise((resolve, reject) => {
      patchAssetFile(asset.id, file)
        .then((newFilename) => {
          // Update local asset state with new file and filename
          asset.setFile(file);
          asset.filename = newFilename;

          spinnerDialog?.close();
          resolve();
        })
        .catch((e) => {
          // Handle errors with user feedback
          this.error("Patch asset file error: " + e.message);
          spinnerDialog?.close();
          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when updating the asset's file. Check the console. ${e.message}`,
            title: "Update Asset File Error"
          };
          MakeAlertDialogUC.make(dialogDTO, this.appObjects);
          resolve(); // Resolve to prevent unhandled rejections, error is already handled
        });
    });
  };

  /**
   * Initializes the UpdateAssetFileUC with validation of required components.
   *
   * @param appObject - The AppObject that should contain the AssetEntity this UC will operate on
   */
  constructor(appObject: AppObject) {
    super(appObject, UpdateAssetFileUC.type);

    this.asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!this.asset) {
      this.error(
        "UC has been added to an App Object that does not have ArchiveAssetUC"
      );
    }
  }
}
