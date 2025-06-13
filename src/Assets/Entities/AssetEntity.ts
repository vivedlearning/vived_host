import {
  AppObject,
  AppObjectEntity,
  MemoizedBoolean,
  MemoizedString
} from "@vived/core";

/**
 * AssetEntity manages individual file-based resources in VIVED applications.
 * 
 * This entity handles:
 * 1. Asset metadata (name, description, owner, archive status)
 * 2. File management (filename, fileURL, blob URL creation)
 * 3. Linked asset relationships for hierarchical asset structures
 * 4. Fetch state management (loading indicators, error handling)
 * 5. Observer pattern implementation for UI updates
 * 
 * Key Concepts:
 * - Uses memoized properties for efficient change tracking and notifications
 * - Supports both file URLs (remote) and blob URLs (local) for flexible file access
 * - Maintains linked asset relationships to support complex asset hierarchies
 * - Implements observer pattern to notify UI components of changes
 * 
 * Usage Patterns:
 * ```typescript
 * // Get an asset entity from an app object
 * const asset = AssetEntity.get(appObject);
 * if (asset) {
 *   // Set asset metadata
 *   asset.name = "My Asset";
 *   asset.description = "A sample asset";
 *   
 *   // Handle file operations
 *   asset.setFile(fileObject);
 *   const blobURL = asset.blobURL; // Access local blob URL
 *   
 *   // Manage linked assets
 *   asset.addLinkedAsset("texture", "texture123");
 *   const textures = asset.getLinkedAssetByType("texture");
 *   
 *   // Monitor fetch state
 *   if (asset.isFetchingFile) {
 *     console.log("File is being downloaded...");
 *   }
 *   if (asset.fetchError) {
 *     console.error("Failed to fetch file:", asset.fetchError.message);
 *   }
 * }
 * ```
 * 
 * Integration Points:
 * - Works with AssetRepo for asset lifecycle management
 * - Integrates with AppAssetsEntity for collection management
 * - Used by GetAssetBlobURLUC for file retrieval operations
 * - Supports caching mechanisms for optimized file access
 */
export abstract class AssetEntity extends AppObjectEntity {
  /** Static type identifier for component registration */
  static type = "AssetEntity";

  /** 
   * Unique identifier for this asset, derived from the underlying AppObject
   * @readonly
   */
  abstract readonly id: string;

  /** 
   * Display name of the asset
   * Triggers change notifications when modified for UI updates
   */
  abstract get name(): string;
  abstract set name(name: string);

  /** 
   * Detailed description of the asset's purpose or content
   * Triggers change notifications when modified for UI updates
   */
  abstract get description(): string;
  abstract set description(description: string);

  /** 
   * ID of the user or entity that owns this asset
   * Used for permission and filtering operations
   */
  abstract get owner(): string;
  abstract set owner(val: string);

  /** 
   * Whether this asset is archived (hidden from normal views)
   * Used for soft deletion and filtering capabilities
   */
  abstract get archived(): boolean;
  abstract set archived(archived: boolean);

  /** 
   * Original filename of the uploaded file
   * Preserved for download operations and display purposes
   */
  abstract get filename(): string;
  abstract set filename(filename: string);

  /** 
   * Remote URL where the file can be accessed
   * Used for fetching the actual file content from external storage
   */
  abstract get fileURL(): string;
  abstract set fileURL(fileURL: string);

  /** 
   * Sets the local file object and creates a blob URL for immediate access
   * @param file - The file object to associate with this asset
   * Side effects: Creates blob URL, triggers change notifications
   */
  abstract setFile(file: File): void;
  
  /** 
   * The local file object if one has been set
   * @returns File object or undefined if no file has been loaded locally
   */
  abstract get file(): File | undefined;
  
  /** 
   * Local blob URL for immediate file access without network requests
   * @returns Blob URL string or undefined if no local file is available
   */
  abstract get blobURL(): string | undefined;
  
  /** 
   * Indicates whether the file has been successfully fetched and stored locally
   * @returns true if file is available locally, false otherwise
   */
  abstract get fileHasBeenFetched(): boolean;

  /** 
   * Array of linked assets that have relationships with this asset
   * Supports hierarchical asset structures (e.g., models with textures)
   * @returns Array of linked asset references with type and ID
   */
  abstract get linkedAssets(): { type: string; id: string }[];
  
  /** 
   * Adds a linked asset relationship
   * @param type - The type/category of the linked asset (e.g., "texture", "sound")
   * @param id - The unique ID of the linked asset
   * Side effects: Triggers change notifications if asset is not already linked
   */
  abstract addLinkedAsset(type: string, id: string): void;
  
  /** 
   * Removes a linked asset relationship
   * @param type - The type/category of the linked asset to remove
   * @param id - The unique ID of the linked asset to remove
   * Side effects: Triggers change notifications if asset was previously linked
   */
  abstract removeLinkedAsset(type: string, id: string): void;
  
  /** 
   * Retrieves all linked asset IDs of a specific type
   * @param type - The type/category to filter by (e.g., "texture", "sound")
   * @returns Array of asset IDs that match the specified type
   */
  abstract getLinkedAssetByType(type: string): string[];

  /** 
   * Indicates whether a file fetch operation is currently in progress
   * Used for showing loading states in UI components
   */
  abstract get isFetchingFile(): boolean;
  abstract set isFetchingFile(isFetchingFile: boolean);

  /** 
   * Any error that occurred during the most recent fetch operation
   * Used for error handling and user feedback in UI components
   */
  abstract get fetchError(): Error | undefined;
  abstract set fetchError(fetchError: Error | undefined);

  /** 
   * Retrieves an AssetEntity component from an AppObject
   * @param appObject - The AppObject to search for the AssetEntity component
   * @returns AssetEntity instance or undefined if not found
   * Logs warning if component is not found to aid in debugging
   */
  static get(appObject: AppObject): AssetEntity | undefined {
    const asset = appObject.getComponent<AssetEntity>(AssetEntity.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "AssetEntity.get",
        "Unable to find AssetEntity on app object " + appObject.id
      );
    }
    return asset;
  }
}

/**
 * Factory function to create a new AssetEntity instance
 * @param appObject - The AppObject that will host this AssetEntity
 * @returns A new AssetEntity implementation instance
 */
export function makeAssetEntity(appObject: AppObject): AssetEntity {
  return new AssetImp(appObject);
}

/**
 * Private implementation of AssetEntity that handles all the concrete functionality.
 * 
 * Key Implementation Details:
 * - Uses MemoizedString and MemoizedBoolean for efficient change tracking
 * - All memoized properties automatically trigger change notifications when modified
 * - Blob URL management with proper cleanup on disposal
 * - Linked asset management with duplicate prevention
 * - File fetch state management for async operations
 * 
 * Memoization Pattern:
 * The implementation uses memoized properties that only trigger change notifications
 * when values actually change, preventing unnecessary UI updates and improving performance.
 * Each memoized property is initialized with a default value and a change callback.
 */
class AssetImp extends AssetEntity {
  /** Returns the unique ID from the underlying AppObject */
  get id(): string {
    return this.appObject.id;
  }

  /** 
   * Memoized asset name with change notification
   * Initialized to empty string, triggers notifyOnChange when modified
   */
  private _memoizedName: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );
  get name(): string {
    return this._memoizedName.val;
  }

  set name(name: string) {
    this._memoizedName.val = name;
  }

  /** 
   * Memoized asset owner with change notification
   * Stores the ID of the user/entity that owns this asset
   */
  private _memoizedOwner: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );
  get owner(): string {
    return this._memoizedOwner.val;
  }

  set owner(val: string) {
    this._memoizedOwner.val = val;
  }

  /** 
   * Memoized asset description with change notification
   * Stores detailed information about the asset's purpose or content
   */
  private _memoizedDescription: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );
  get description(): string {
    return this._memoizedDescription.val;
  }

  set description(description: string) {
    this._memoizedDescription.val = description;
  }

  /** 
   * Memoized archive status with change notification
   * Used for soft deletion and filtering of assets
   */
  private _memoizedArchived: MemoizedBoolean = new MemoizedBoolean(
    false,
    this.notifyOnChange
  );
  get archived(): boolean {
    return this._memoizedArchived.val;
  }

  set archived(archived: boolean) {
    this._memoizedArchived.val = archived;
  }

  /** 
   * Memoized file URL for remote asset access
   * Points to where the actual file can be downloaded from
   */
  private _memoizedFileURL: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );
  
  /** 
   * Memoized filename for display and download purposes
   * Preserves the original name of the uploaded file
   */
  private _memoizedFilename: MemoizedString = new MemoizedString(
    "",
    this.notifyOnChange
  );

  get filename(): string {
    return this._memoizedFilename.val;
  }
  set filename(name: string) {
    this._memoizedFilename.val = name;
  }
  get fileURL(): string {
    return this._memoizedFileURL.val;
  }

  set fileURL(name: string) {
    this._memoizedFileURL.val = name;
  }

  /** Local file object storage */
  private _file: File | undefined = undefined;
  
  /** Local blob URL for immediate file access */
  private _blobURL: string | undefined = undefined;

  /** 
   * Sets a local file and creates a blob URL for immediate access
   * This is typically called after successfully downloading a file
   * @param file - The file object to store locally
   * Side effects: Creates blob URL, triggers change notifications to update UI
   */
  setFile = (file: File) => {
    this._file = file;
    this._blobURL = URL.createObjectURL(file);
    this.notifyOnChange();
  };

  /** Returns the locally stored file object, if any */
  get file(): File | undefined {
    return this._file;
  }

  /** Returns the blob URL for local file access, if available */
  get blobURL(): string | undefined {
    return this._blobURL;
  }

  /** 
   * Indicates whether a file has been successfully fetched and stored locally
   * Used to determine if file operations can proceed without network requests
   */
  get fileHasBeenFetched(): boolean {
    return this._file !== undefined;
  }

  /** 
   * Storage for linked asset relationships
   * Supports hierarchical asset structures where assets depend on other assets
   */
  private _linkedAssets: { type: string; id: string }[] = [];
  
  /** 
   * Returns a copy of all linked assets to prevent external modification
   * This ensures the internal state cannot be corrupted by external code
   */
  get linkedAssets(): { type: string; id: string }[] {
    return [...this._linkedAssets];
  }

  /** 
   * Adds a linked asset relationship if it doesn't already exist
   * Prevents duplicate relationships and maintains data integrity
   * @param type - Category of the linked asset (e.g., "texture", "sound", "model")
   * @param id - Unique identifier of the linked asset
   */
  addLinkedAsset = (type: string, id: string) => {
    const existingAsset = this._linkedAssets.find((asset) => {
      return asset.id === id;
    });

    if (existingAsset === undefined) {
      this._linkedAssets.push({
        id,
        type
      });
      this.notifyOnChange();
    }
  };

  /** 
   * Removes a linked asset relationship if it exists
   * Maintains referential integrity by only removing exact matches
   * @param type - Category of the linked asset to remove
   * @param id - Unique identifier of the linked asset to remove
   */
  removeLinkedAsset = (type: string, id: string) => {
    let foundAsset: boolean = false;
    this._linkedAssets.forEach((asset) => {
      if (asset.type === type && asset.id === id) {
        foundAsset = true;
      }
    });

    if (foundAsset) {
      this._linkedAssets = this._linkedAssets.filter(
        (asset) => asset.id !== id
      );
      this.notifyOnChange();
    }
  };

  /** 
   * Retrieves all linked asset IDs of a specific type
   * Useful for finding all assets of a particular category (e.g., all textures)
   * @param type - The asset type to filter by
   * @returns Array of asset IDs matching the specified type
   */
  getLinkedAssetByType = (type: string): string[] => {
    const rVal: string[] = [];

    this._linkedAssets.forEach((asset) => {
      if (asset.type === type) {
        rVal.push(asset.id);
      }
    });

    return rVal;
  };

  /** 
   * Memoized fetch state indicator with change notification
   * Used to show loading states in UI during file download operations
   */
  private _memoizedIsFetchingFile: MemoizedBoolean = new MemoizedBoolean(
    false,
    this.notifyOnChange
  );
  get isFetchingFile(): boolean {
    return this._memoizedIsFetchingFile.val;
  }
  set isFetchingFile(archived: boolean) {
    this._memoizedIsFetchingFile.val = archived;
  }

  /** 
   * Storage for the most recent fetch error
   * Helps with error handling and user feedback in UI components
   */
  private _fetchError: Error | undefined = undefined;
  
  /** Returns the current fetch error, if any */
  get fetchError(): Error | undefined {
    return this._fetchError;
  }
  
  /** 
   * Sets the fetch error with smart change detection
   * Only triggers change notifications if the error actually changes
   * This prevents unnecessary UI updates when the same error is set multiple times
   * @param fetchError - The error that occurred, or undefined to clear the error
   */
  set fetchError(fetchError: Error | undefined) {
    if (fetchError === undefined && this.fetchError === undefined) return;

    if (
      fetchError !== undefined &&
      this.fetchError !== undefined &&
      fetchError.message === this.fetchError.message
    )
      return;

    this._fetchError = fetchError;
    this.notifyOnChange();
  }

  /** 
   * Cleanup method that properly releases blob URL resources
   * Important: Blob URLs must be revoked to prevent memory leaks
   * This is automatically called when the entity is disposed
   * Side effects: Revokes blob URL, triggers change notification, calls parent dispose
   */
  dispose = () => {
    if (this._blobURL !== undefined) {
      URL.revokeObjectURL(this._blobURL);
      this._blobURL = undefined;
      this.notifyOnChange();
    }
    super.dispose();
  };

  /** 
   * Initializes the AssetEntity with proper component registration
   * @param appObject - The AppObject that will host this entity
   */
  constructor(appObject: AppObject) {
    super(appObject, AssetEntity.type);
  }
}
