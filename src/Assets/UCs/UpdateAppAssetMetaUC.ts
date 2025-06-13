/**
 * UpdateAppAssetMetaUC.ts
 *
 * This use case handles updating asset metadata (name, description, archived status)
 * for existing assets. It provides a complete workflow for modifying asset information
 * with user feedback and sandbox state management.
 *
 * Key Concepts:
 * - Updates asset metadata without affecting the actual file content
 * - Uses API calls to persist metadata changes on the backend
 * - Provides user feedback through spinner and error dialogs
 * - Manages sandbox state transitions after successful updates
 * - Supports partial metadata updates through DTO pattern
 *
 * Usage Patterns:
 * - Created per-asset during factory setup
 * - Accessed through static get() method with asset ID
 * - Called with metadata DTO containing updated field values
 * - Handles async operations with proper error handling and user feedback
 */

import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import {
  AppSandboxEntity,
  SandboxState
} from "../../AppSandbox/Entities/AppSandboxEntity";
import { DialogAlertDTO } from "../../Dialog/Entities";
import { MakeAlertDialogUC, MakeSpinnerDialogUC } from "../../Dialog/UCs";
import { PatchAssetMetaUC } from "../../VivedAPI/UCs/PatchAssetMetaUC";
import { AssetEntity } from "../Entities";

/**
 * Data transfer object for asset metadata updates.
 * Contains all the metadata fields that can be modified for an asset.
 */
export interface UpdateAppAssetMetaDTO {
  /** Display name for the asset */
  name: string;
  /** Detailed description of the asset's purpose or content */
  description: string;
  /** Whether the asset should be archived (hidden from normal views) */
  archived: boolean;
}

/**
 * UpdateAppAssetMetaUC manages updating the metadata of individual assets.
 *
 * This use case provides the business logic for modifying asset metadata,
 * handling API persistence, and managing user feedback during the operation.
 */
export abstract class UpdateAppAssetMetaUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "UpdateAppAssetMetaUC";

  /**
   * Updates the metadata of the associated asset.
   *
   * @param data - DTO containing the updated metadata fields
   * @returns Promise that resolves when the operation completes successfully
   */
  abstract updateMeta(data: UpdateAppAssetMetaDTO): Promise<void>;

  /**
   * Retrieves an UpdateAppAssetMetaUC component for a specific asset.
   *
   * @param assetID - The unique identifier of the asset
   * @param appObjects - Repository for accessing app objects and components
   * @returns UpdateAppAssetMetaUC instance or undefined if not found
   */
  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): UpdateAppAssetMetaUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "UpdateAppAssetMetaUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<UpdateAppAssetMetaUC>(
      UpdateAppAssetMetaUC.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "UpdateAppAssetMetaUC.get",
        "App Object does not have UpdateAssetMetaUC"
      );
      return undefined;
    }

    return uc;
  }
}

/**
 * Factory function to create a new UpdateAppAssetMetaUC instance.
 *
 * @param appObject - The AppObject that will host this use case (should contain an AssetEntity)
 * @returns A new UpdateAppAssetMetaUC implementation instance
 */
export function makeUpdateAppAssetMetaUC(
  appObject: AppObject
): UpdateAppAssetMetaUC {
  return new UpdateAppAssetMetaUCImp(appObject);
}

/**
 * Private implementation of UpdateAppAssetMetaUC that handles the concrete metadata update operations.
 *
 * Key Implementation Details:
 * - Gets asset entity from local AppObject components
 * - Uses PatchAssetMetaUC for backend API persistence
 * - Shows spinner dialogs during metadata update operations
 * - Handles errors gracefully with alert dialogs and logging
 * - Updates local asset state after successful API operations
 * - Manages sandbox state transitions for UI consistency
 */
class UpdateAppAssetMetaUCImp extends UpdateAppAssetMetaUC {
  /** Gets the asset entity from the local AppObject this UC operates on */
  private get asset() {
    return this.getCachedLocalComponent<AssetEntity>(AssetEntity.type);
  }

  /** Gets the spinner dialog factory for showing user feedback during operations */
  private get spinnerFactory() {
    return this.getCachedSingleton<MakeSpinnerDialogUC>(
      MakeSpinnerDialogUC.type
    );
  }

  /** Gets the API use case for patching asset metadata on the backend */
  private get patchAssetMeta() {
    return this.getCachedSingleton<PatchAssetMetaUC>(PatchAssetMetaUC.type)
      ?.doPatch;
  }

  /** Gets the alert dialog factory for showing error messages to users */
  private get alertFactory() {
    return this.getCachedSingleton<MakeAlertDialogUC>(MakeAlertDialogUC.type);
  }

  /** Gets the sandbox entity for managing application state transitions */
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  /**
   * Updates the asset metadata with full error handling and user feedback.
   *
   * This method handles the complete metadata update workflow:
   * 1. Validates the asset exists and required dependencies are available
   * 2. Shows a spinner dialog during the API operation
   * 3. Patches the metadata on the backend via API
   * 4. Updates the local asset entity with the new metadata
   * 5. Manages sandbox state transitions for UI consistency
   * 6. Shows error dialogs and logs failures appropriately
   *
   * @param data - DTO containing the updated metadata fields
   * @returns Promise that resolves when the operation completes (successfully or with handled error)
   */
  updateMeta = (data: UpdateAppAssetMetaDTO): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    const patchAssetMeta = this.patchAssetMeta;
    if (!patchAssetMeta) {
      return Promise.reject(new Error("No Patch UC"));
    }

    const { archived, description, name } = data;

    // Show user feedback during operation
    const spinnerDialog = this.spinnerFactory?.make({
      title: "Asset Meta",
      message: "Updating asset's meta..."
    });

    return new Promise((resolve, reject) => {
      patchAssetMeta({
        archived,
        description,
        id: asset.id,
        name
      })
        .then(() => {
          // Update local asset state with new metadata
          asset.archived = archived;
          asset.name = name;
          asset.description = description;

          spinnerDialog?.close();

          // Manage sandbox state for UI consistency
          if (this.sandbox) this.sandbox.state = SandboxState.MOUNTED;

          resolve();
        })
        .catch((e) => {
          // Handle errors with user feedback
          this.error("Patch asset error: " + e.message);
          spinnerDialog?.close();
          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when updating the assets meta. Check the console. ${e.message}`,
            title: "Update Asset Error"
          };
          this.alertFactory?.make(dialogDTO);
          resolve(); // Resolve to prevent unhandled rejections, error is already handled
        });
    });
  };

  /**
   * Initializes the UpdateAppAssetMetaUC.
   *
   * @param appObject - The AppObject that should contain the AssetEntity this UC will operate on
   */
  constructor(appObject: AppObject) {
    super(appObject, UpdateAppAssetMetaUC.type);
  }
}
