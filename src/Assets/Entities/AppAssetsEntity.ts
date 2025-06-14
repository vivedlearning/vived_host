import {
  AppObject,
  AppObjectEntity,
  AppObjectRepo,
  getSingletonComponent,
  MemoizedBoolean
} from "@vived/core";
import { AssetEntity } from "./AssetEntity";

/**
 * AppAssetsEntity manages the collection of assets associated with a specific VIVED application.
 *
 * This singleton entity handles:
 * 1. Asset collection management (add, remove, query operations)
 * 2. Editing state management with automatic observer registration
 * 3. Archive filtering functionality for showing/hiding archived assets
 * 4. Global asset reference tracking for applications
 *
 * Key Concepts:
 * - Singleton pattern ensures only one instance exists per application
 * - Observer pattern integration for automatic UI updates when editing state changes
 * - Smart observer management prevents memory leaks by properly registering/unregistering
 * - Archive filtering support for improved user experience
 *
 * Usage Patterns:
 * ```typescript
 * // Get the global app assets entity
 * const appAssets = AppAssetsEntity.get(appObjects);
 * if (appAssets) {
 *   // Manage asset collection
 *   appAssets.add("asset123");
 *   const allAssets = appAssets.getAll();
 *   const hasAsset = appAssets.has("asset123");
 *   appAssets.remove("asset123");
 *
 *   // Manage editing state
 *   const assetEntity = AssetEntity.get(someAppObject);
 *   appAssets.editingAsset = assetEntity; // Automatically registers observers
 *
 *   // Control archive visibility
 *   appAssets.showArchived = true; // Show archived assets
 *   appAssets.showArchived = false; // Hide archived assets
 * }
 * ```
 *
 * Integration Points:
 * - Works with AssetRepo for asset lifecycle management
 * - Integrates with AssetEntity for individual asset operations
 * - Used by GetAppAssetsUC for bulk asset operations
 * - Supports UI components through observer pattern notifications
 */
export abstract class AppAssetsEntity extends AppObjectEntity {
  /** Static type identifier for component registration */
  static type = "AppAssetsEntity";

  /**
   * Retrieves all asset IDs in this application's collection
   * @returns Array of asset IDs, returned as a copy to prevent external modification
   */
  abstract getAll(): string[];

  /**
   * Adds an asset ID to the collection if not already present
   * @param assetID - The unique identifier of the asset to add
   * Side effects: Triggers change notifications for UI updates
   */
  abstract add(assetID: string): void;

  /**
   * Checks if an asset ID exists in the collection
   * @param assetID - The unique identifier to check for
   * @returns true if the asset is in the collection, false otherwise
   */
  abstract has(assetID: string): boolean;

  /**
   * Removes an asset ID from the collection if present
   * @param assetID - The unique identifier of the asset to remove
   * Side effects: Triggers change notifications for UI updates
   */
  abstract remove(assetID: string): void;

  /**
   * The asset currently being edited, if any
   * When set, automatically manages observer registration for change notifications
   * Setting to undefined clears the editing state
   */
  abstract get editingAsset(): AssetEntity | undefined;
  abstract set editingAsset(val: AssetEntity | undefined);

  /**
   * Controls whether archived assets are shown in UI components
   * When true, archived assets are included in queries and displays
   * When false, archived assets are filtered out for better UX
   */
  abstract get showArchived(): boolean;
  abstract set showArchived(show: boolean);

  /**
   * Retrieves the singleton AppAssetsEntity from the host application objects
   * @param hostAppObjects - The application object repository to search
   * @returns AppAssetsEntity instance or undefined if not found
   * Uses getSingletonComponent to ensure only one instance exists
   */
  static get(hostAppObjects: AppObjectRepo): AppAssetsEntity | undefined {
    return getSingletonComponent(AppAssetsEntity.type, hostAppObjects);
  }
}

/**
 * Factory function to create a new AppAssetsEntity instance
 * @param appObj - The AppObject that will host this AppAssetsEntity
 * @returns A new AppAssetsEntity implementation instance
 */
export function makeAppAssets(appObj: AppObject): AppAssetsEntity {
  return new AppAssetsImp(appObj);
}

/**
 * Private implementation of AppAssetsEntity that handles all concrete functionality.
 *
 * Key Implementation Details:
 * - Maintains an array of asset IDs for the application
 * - Smart observer management for editing asset changes
 * - Memoized archive visibility flag with change notifications
 * - Automatic singleton registration ensures global accessibility
 *
 * Observer Management Pattern:
 * The editing asset property automatically manages observer registration to ensure
 * that UI components are notified when the currently edited asset changes.
 * When a new asset is set for editing, observers from the previous asset are
 * properly removed to prevent memory leaks and duplicate notifications.
 */
class AppAssetsImp extends AppAssetsEntity {
  /** Internal storage for the collection of asset IDs */
  private appAssets: string[] = [];

  /** Internal reference to the currently editing asset */
  private _editingAsset: AssetEntity | undefined;

  /**
   * Returns the currently editing asset
   * @returns The AssetEntity being edited, or undefined if none
   */
  get editingAsset(): AssetEntity | undefined {
    return this._editingAsset;
  }

  /**
   * Sets the currently editing asset with smart observer management
   * Automatically handles observer registration/deregistration to prevent memory leaks
   * @param val - The AssetEntity to edit, or undefined to clear editing state
   * Side effects:
   * - Removes observers from previous editing asset
   * - Adds observers to new editing asset
   * - Triggers change notifications for UI updates
   */
  set editingAsset(val: AssetEntity | undefined) {
    if (val?.id === this._editingAsset?.id) return;

    if (this._editingAsset) {
      this._editingAsset.removeChangeObserver(this.notifyOnChange);
    }

    this._editingAsset = val;

    if (this._editingAsset) {
      this._editingAsset.addChangeObserver(this.notifyOnChange);
    }

    this.notifyOnChange();
  }

  /**
   * Retrieves all asset IDs in the collection
   * Returns a copy to prevent external modification of internal state
   * @returns Array of asset IDs
   */
  getAll = (): string[] => {
    return [...this.appAssets];
  };

  /**
   * Adds an asset ID to the collection if not already present
   * Prevents duplicate entries and maintains collection integrity
   * @param assetID - The asset ID to add
   * Side effects: Triggers change notifications if asset was added
   */
  add = (assetID: string): void => {
    if (this.appAssets.includes(assetID)) return;

    this.appAssets.push(assetID);
    this.notifyOnChange();
  };

  /**
   * Checks if an asset ID exists in the collection
   * @param assetID - The asset ID to check for
   * @returns true if asset exists in collection, false otherwise
   */
  has(assetID: string): boolean {
    return this.appAssets.includes(assetID);
  }

  /**
   * Removes an asset ID from the collection if present
   * @param assetID - The asset ID to remove
   * Side effects: Triggers change notifications if asset was removed
   */
  remove(assetID: string): void {
    const index = this.appAssets.indexOf(assetID, 0);
    if (index > -1) {
      this.appAssets.splice(index, 1);
      this.notifyOnChange();
    }
  }

  /**
   * Memoized archive visibility flag with change notification
   * Controls whether archived assets should be shown in UI components
   * Defaults to false (archived assets hidden)
   */
  private memoizedShowArchived = new MemoizedBoolean(
    false,
    this.notifyOnChange
  );

  /**
   * Returns the current archive visibility setting
   * @returns true if archived assets should be shown, false to hide them
   */
  get showArchived(): boolean {
    return this.memoizedShowArchived.val;
  }

  /**
   * Sets the archive visibility with change notification
   * @param show - true to show archived assets, false to hide them
   * Side effects: Triggers change notifications for UI updates
   */
  set showArchived(show: boolean) {
    this.memoizedShowArchived.val = show;
  }

  /**
   * Initializes the AppAssetsEntity with singleton registration
   * @param appObj - The AppObject that will host this entity
   * Side effects: Registers this instance as a singleton for global access
   */
  constructor(appObj: AppObject) {
    super(appObj, AppAssetsEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
