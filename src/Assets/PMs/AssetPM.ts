/**
 * AssetPM.ts
 * 
 * This presentation manager handles the view model generation and change tracking
 * for individual asset entities, providing a clean interface between asset data
 * and UI components.
 * 
 * Key Concepts:
 * - Transforms asset entity data into view models for UI consumption
 * - Tracks entity changes and triggers UI updates when needed
 * - Provides efficient comparison methods for view model equality
 * - Manages asset entity lifecycle and observer patterns
 * - Follows the PM pattern for separation of concerns between domain and presentation
 * 
 * Usage Patterns:
 * - Created per-asset during factory setup
 * - Accessed through static getByID() method with asset ID
 * - Automatically updates UI components when underlying asset data changes
 * - Used by adapters to connect asset data to React components and other UI frameworks
 */

import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { AssetEntity } from "../Entities/AssetEntity";

/**
 * View model interface representing asset data optimized for UI display.
 * Contains essential asset information formatted for presentation components.
 */
export interface AssetVM {
  /** Unique identifier of the asset */
  id: string;
  /** Display name of the asset */
  name: string;
  /** Description of the asset's purpose or content */
  description: string;
  /** Whether the asset is archived (hidden from normal views) */
  archived: boolean;
}

/**
 * AssetPM manages presentation logic for individual asset entities.
 * 
 * This presentation manager bridges the gap between asset domain entities
 * and UI components by providing optimized view models and change tracking.
 */
export abstract class AssetPM extends AppObjectPM<AssetVM> {
  /** Static type identifier for component registration */
  static type = "AssetPM";

  /**
   * Retrieves an AssetPM component for a specific asset.
   * 
   * @param assetID - The unique identifier of the asset
   * @param appObjects - Repository for accessing app objects and components
   * @returns AssetPM instance or undefined if not found
   */
  static getByID(
    assetID: string,
    appObjects: AppObjectRepo
  ): AssetPM | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning(
        "AssetPM.getByID",
        "Unable to find app object by ID " + assetID
      );
      return;
    }

    const pm = appObject.getComponent<AssetPM>(AssetPM.type);
    if (!pm) {
      appObjects.submitWarning(
        "AssetPM.getByID",
        "App Object does not have a AssetPM"
      );
      return;
    }
    return pm;
  }
}

/**
 * Factory function to create a new AssetPM instance.
 * 
 * @param appObject - The AppObject that will host this PM (should contain an AssetEntity)
 * @returns A new AssetPM implementation instance
 */
export function makeAssetPM(appObject: AppObject): AssetPM {
  return new AssetPMImp(appObject);
}

/**
 * Private implementation of AssetPM with entity integration and change tracking.
 * 
 * Key Implementation Details:
 * - Observes AssetEntity changes and generates view models accordingly
 * - Implements efficient view model comparison for performance optimization
 * - Handles entity lifecycle management and cleanup
 * - Provides error handling for missing entity dependencies
 */
class AssetPMImp extends AssetPM {
  /** The asset entity this PM observes and presents */
  private asset?: AssetEntity;

  /**
   * Compares two asset view models for equality to optimize UI updates.
   * 
   * @param a - First asset view model to compare
   * @param b - Second asset view model to compare
   * @returns true if view models are equal, false otherwise
   */
  vmsAreEqual(a: AssetVM, b: AssetVM): boolean {
    if (a.archived !== b.archived) return false;
    if (a.description !== b.description) return false;
    if (a.name !== b.name) return false;
    if (a.id !== b.id) return false;

    return true;
  }

  private onAssetChange = () => {
    if (!this.asset) return;

    const vm: AssetVM = {
      archived: this.asset.archived,
      description: this.asset.description,
      id: this.asset.id,
      name: this.asset.name
    };

    this.doUpdateView(vm);
  };

  constructor(appObject: AppObject) {
    super(appObject, AssetPM.type);

    this.asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!this.asset) {
      this.warn("PM has been added to an App Object without an AssetEntity");
      return;
    }

    this.asset.addChangeObserver(this.onAssetChange);
    this.onAssetChange();
  }
}

export const defaultAssetVM: AssetVM = {
  archived: false,
  description: "",
  id: "",
  name: ""
};
