/**
 * DownloadAssetFileUC.ts
 * 
 * This use case handles downloading asset files to the user's local system,
 * managing both cached and remote file retrieval with browser download triggers.
 * 
 * Key Concepts:
 * - Downloads asset files to user's local file system via browser
 * - Handles both cached (blob URL) and remote file sources
 * - Uses GetAssetFileUC for remote file retrieval when needed
 * - Provides user feedback through spinner dialogs during downloads
 * - Triggers browser download mechanism using temporary anchor elements
 * 
 * Usage Patterns:
 * - Created per-asset during factory setup
 * - Accessed through static get() method with asset ID
 * - Handles both immediate downloads (cached files) and fetch-then-download (remote files)
 * - Manages async operations with proper error handling and user feedback
 */

import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import {
  DialogAlertDTO,
  MakeAlertDialogUC,
  MakeSpinnerDialogUC
} from "../../Dialog";
import { AssetEntity } from "../Entities/AssetEntity";
import { GetAssetFileUC } from "./GetAssetFileUC";

/**
 * DownloadAssetFileUC manages downloading asset files to the user's local system.
 * 
 * This use case handles the complete download workflow, from file retrieval
 * (if necessary) to triggering the browser's download mechanism.
 */
export abstract class DownloadAssetFileUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "DownloadAssetFileUC";

  /**
   * Downloads the associated asset file to the user's local system.
   * 
   * @returns Promise that resolves when the download operation completes
   */
  abstract download(): Promise<void>;

  /**
   * Triggers the browser download mechanism for a cached asset file.
   * This method assumes the asset already has a blob URL available.
   */
  abstract saveFileLocally(): void;

  /**
   * Retrieves a DownloadAssetFileUC component for a specific asset.
   * 
   * @param assetID - The unique identifier of the asset
   * @param appObjects - Repository for accessing app objects and components
   * @returns DownloadAssetFileUC instance or undefined if not found
   */
  static get(
    assetID: string,
    appObjects: AppObjectRepo
  ): DownloadAssetFileUC | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "DownloadAssetFileUC.get",
        "Unable to find app object"
      );
      return undefined;
    }

    const uc = appObject.getComponent<DownloadAssetFileUC>(
      DownloadAssetFileUC.type
    );
    if (!uc) {
      appObjects.submitWarning(
        "DownloadAssetFileUC.get",
        "App Object does not have DownloadAssetFileUC"
      );
      return undefined;
    }

    return uc;
  }
}

/**
 * Factory function to create a new DownloadAssetFileUC instance.
 * 
 * @param appObject - The AppObject that will host this use case (should contain an AssetEntity)
 * @returns A new DownloadAssetFileUC implementation instance
 */
export function makeDownloadAssetFileUC(
  appObject: AppObject
): DownloadAssetFileUC {
  return new DownloadAssetFileUCImp(appObject);
}

/**
 * Private implementation of DownloadAssetFileUC that handles the concrete download operations.
 * 
 * Key Implementation Details:
 * - Checks for cached blob URLs to enable immediate downloads
 * - Falls back to GetAssetFileUC for remote file retrieval
 * - Shows spinner dialogs during file fetch operations
 * - Handles errors gracefully with alert dialogs and logging
 * - Uses DOM manipulation to trigger browser downloads
 * - Preserves original filenames for downloaded files
 */
class DownloadAssetFileUCImp extends DownloadAssetFileUC {
  /** The asset entity this use case operates on */
  private asset?: AssetEntity;

  /** 
   * Gets the use case for retrieving asset files from remote sources
   * Used when the asset file is not already cached locally
   */
  private get getAssetFile() {
    return this.getCachedSingleton<GetAssetFileUC>(GetAssetFileUC.type)
      ?.getAssetFile;
  }

  /**
   * Downloads the asset file with smart caching and user feedback.
   * 
   * This method implements the complete download workflow:
   * 1. Validates the asset exists
   * 2. If a blob URL exists, triggers immediate download
   * 3. If no blob URL, fetches the file from remote source first
   * 4. Shows spinner dialog during remote fetch operations
   * 5. Triggers download once file is available locally
   * 6. Handles errors with appropriate user feedback
   * 
   * @returns Promise that resolves when the download operation completes
   */
  download = (): Promise<void> => {
    const asset = this.asset;

    if (!asset) {
      return Promise.reject(new Error("No Asset Entity"));
    }

    // If file is already cached, download immediately
    if (asset.blobURL) {
      this.saveFileLocally();
      return Promise.resolve();
    }

    // Need to fetch file first
    const getAssetFile = this.getAssetFile;
    if (!getAssetFile) {
      return Promise.reject();
    }

    // Show user feedback during fetch operation
    const title = "Download Asset";
    const spinnerDialog = MakeSpinnerDialogUC.make(
      {
        title,
        message: "Downloading asset..."
      },
      this.appObjects
    );

    return new Promise((resolve) => {
      getAssetFile(asset.id)
        .then(() => {
          spinnerDialog?.close();
          this.saveFileLocally();
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
   * Triggers the browser's download mechanism for the cached asset file.
   * 
   * This method creates a temporary anchor element with the blob URL and
   * programmatically clicks it to trigger the browser download. The download
   * preserves the original filename from the asset metadata.
   */
  saveFileLocally = () => {
    if (!this.asset) {
      this.error("No Asset");
      return;
    }

    if (!this.asset.blobURL) {
      this.error("No blob URL");
      return;
    }

    // Create temporary anchor element to trigger download
    const a = document.createElement("a");
    a.href = this.asset.blobURL;
    a.download = this.asset.filename;
    a.click();
  };

  /**
   * Initializes the DownloadAssetFileUC with validation of required components.
   * 
   * @param appObject - The AppObject that should contain the AssetEntity this UC will operate on
   */
  constructor(appObject: AppObject) {
    super(appObject, DownloadAssetFileUC.type);

    this.asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!this.asset) {
      this.error(
        "UC has been added to an App Object that does not have ArchiveAssetUC"
      );
    }
  }
}
