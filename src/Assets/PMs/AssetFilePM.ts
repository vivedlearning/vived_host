// filepath: c:\Users\amosp\Documents\WebGL\vivedlearning_host\src\Assets\PMs\AssetFilePM.ts
import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { AssetEntity } from "../Entities/AssetEntity";

/**
 * View Model for Asset file information
 * Represents the data needed by the view to display asset file status
 */
export interface AssetFileVM {
  /** URL to the asset's file blob for direct access */
  blobURL: string | undefined;
  /** Whether the asset file is currently being fetched */
  isFetchingFile: boolean;
  /** Whether the asset file has been successfully fetched */
  fileHasBeenFetched: boolean;
  /** Error that occurred during file fetching, if any */
  fetchError: Error | undefined;
}

/**
 * Default empty AssetFileVM for initialization
 */
export const defaultAssetFileVM: AssetFileVM = {
  blobURL: undefined,
  isFetchingFile: false,
  fileHasBeenFetched: false,
  fetchError: undefined
};

/**
 * Presentation Manager for Asset file status
 *
 * The AssetFilePM is responsible for:
 * - Converting the file-related properties of AssetEntity into a view-friendly format (AssetFileVM)
 * - Notifying the view when asset file status changes
 * - Providing comparison utilities for view models
 *
 * Usage:
 * 1. Retrieve an instance with `AssetFilePM.getByID(assetId, appObjects)`
 * 2. Subscribe to view updates with `pm.addView(callback)`
 * 3. Access current view data with `pm.lastVM`
 */
export abstract class AssetFilePM extends AppObjectPM<AssetFileVM> {
  static type = "AssetFilePM";

  /**
   * Retrieves an AssetFilePM instance for a specific asset by ID
   *
   * @param assetID - The unique identifier of the asset
   * @param appObjects - The repository of app objects
   * @returns The AssetFilePM instance or undefined if not found
   */
  static getByID(
    assetID: string,
    appObjects: AppObjectRepo
  ): AssetFilePM | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "AssetFilePM.getByID",
        "Unable to find app object by ID " + assetID
      );
      return;
    }

    const pm = appObject.getComponent<AssetFilePM>(AssetFilePM.type);
    if (!pm) {
      appObjects.submitWarning(
        "AssetFilePM.getByID",
        "App Object does not have a AssetFilePM"
      );
      return;
    }
    return pm;
  }
}

/**
 * Creates a new AssetFilePM instance
 *
 * @param appObject - The app object to associate with this PM
 * @returns A new AssetFilePM instance
 */
export function makeAssetFilePM(appObject: AppObject): AssetFilePM {
  return new AssetFilePMImp(appObject);
}

/**
 * Implementation of the AssetFilePM abstract class
 * Handles the connection between AssetEntity file properties and view
 */
class AssetFilePMImp extends AssetFilePM {
  private get asset() {
    return this.getCachedLocalComponent<AssetEntity>(AssetEntity.type);
  }

  /**
   * Compares two AssetFileVM instances for equality
   * Used to determine if the view needs to update
   *
   * @param a - First AssetFileVM to compare
   * @param b - Second AssetFileVM to compare
   * @returns True if view models are equal, false otherwise
   */
  vmsAreEqual(a: AssetFileVM, b: AssetFileVM): boolean {
    if (a.blobURL !== b.blobURL) return false;
    if (a.isFetchingFile !== b.isFetchingFile) return false;
    if (a.fileHasBeenFetched !== b.fileHasBeenFetched) return false;

    // Handle errors comparison (both undefined, or same message)
    if (a.fetchError !== b.fetchError) {
      if (a.fetchError === undefined && b.fetchError !== undefined)
        return false;
      if (a.fetchError !== undefined && b.fetchError === undefined)
        return false;
      if (
        a.fetchError !== undefined &&
        b.fetchError !== undefined &&
        a.fetchError.message !== b.fetchError.message
      )
        return false;
    }

    return true;
  }

  /**
   * Observer callback that updates the view model when the entity changes
   * Transforms entity data into view model format
   */
  private onAssetChange = () => {
    if (!this.asset) return;

    const vm: AssetFileVM = {
      blobURL: this.asset.blobURL,
      isFetchingFile: this.asset.isFetchingFile,
      fileHasBeenFetched: this.asset.fileHasBeenFetched,
      fetchError: this.asset.fetchError
    };

    this.doUpdateView(vm);
  };

  /**
   * Cleans up resources and removes observers when the PM is disposed
   */
  dispose(): void {
    if (this.asset) {
      this.asset.removeChangeObserver(this.onAssetChange);
    }
    super.dispose();
  }

  /**
   * Creates a new AssetFilePMImp instance
   *
   * @param appObject - The app object to associate with this PM
   */
  constructor(appObject: AppObject) {
    super(appObject, AssetFilePM.type);

    this.asset?.addChangeObserver(this.onAssetChange);
    this.onAssetChange();
  }
}
