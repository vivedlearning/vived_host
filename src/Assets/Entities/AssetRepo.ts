import {
  getSingletonComponent,
  AppObject,
  AppObjectEntity,
  AppObjectRepo
} from "@vived/core";
import { AssetEntity, makeAssetEntity } from "./AssetEntity";

/**
 * Data Transfer Object interface for asset operations between external APIs and the asset system.
 * 
 * This interface defines the structure for transferring asset data from external sources
 * (such as APIs, databases, or file systems) into the VIVED asset management system.
 * It includes all necessary metadata and supports hierarchical asset relationships.
 * 
 * @interface AssetDTO
 * @property id - Unique identifier for the asset
 * @property ownerId - ID of the user or entity that owns this asset
 * @property name - Display name of the asset
 * @property description - Detailed description of the asset's purpose or content
 * @property archived - Whether the asset is archived (soft deleted)
 * @property filename - Original filename of the uploaded file
 * @property fileURL - Remote URL where the file can be accessed
 * @property linkedAssets - Array of linked asset relationships with type and nested DTO
 */
export interface AssetDTO {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  archived: boolean;
  filename: string;
  fileURL: string;
  linkedAssets: { type: string; asset: AssetDTO }[];
}

/**
 * AssetRepo implements the Repository pattern for asset lifecycle management in VIVED applications.
 * 
 * This singleton entity handles:
 * 1. Asset CRUD operations (Create, Read, Update, Delete)
 * 2. Factory pattern for asset creation with dependency injection support
 * 3. DTO to entity mapping for external data integration
 * 4. Recursive linked asset processing for complex hierarchies
 * 5. Asset lookup and caching for performance optimization
 * 
 * Key Concepts:
 * - Repository pattern provides a clean abstraction over asset storage
 * - Factory pattern allows for customizable asset creation strategies
 * - DTO processing supports complex asset hierarchies with linked relationships
 * - Singleton pattern ensures consistent asset management across the application
 * 
 * Usage Patterns:
 * ```typescript
 * // Get the global asset repository
 * const assetRepo = AssetRepo.get(appObjects);
 * if (assetRepo) {
 *   // Basic CRUD operations
 *   const asset = assetRepo.getOrCreate("asset123");
 *   assetRepo.add(asset);
 *   const allAssets = assetRepo.getAll();
 *   const exists = assetRepo.has("asset123");
 *   assetRepo.remove("asset123");
 *   
 *   // DTO processing for external data
 *   const assetDTO = {
 *     id: "asset456",
 *     name: "Sample Asset",
 *     // ... other properties
 *     linkedAssets: [
 *       { type: "texture", asset: textureDTO },
 *       { type: "sound", asset: soundDTO }
 *     ]
 *   };
 *   const createdAsset = assetRepo.addFromDTO(assetDTO);
 * }
 * ```
 * 
 * Integration Points:
 * - Works with AssetEntity for individual asset management
 * - Integrates with AppAssetsEntity for collection operations
 * - Used by GetAppAssetsUC and other use cases for bulk operations
 * - Supports external APIs through DTO processing
 */
export abstract class AssetRepo extends AppObjectEntity {
  /** Static type identifier for component registration */
  static type = "AssetRepository";

  /** 
   * Adds an asset to the repository if not already present
   * @param asset - The AssetEntity to add to the repository
   * Side effects: Triggers change notifications for UI updates
   */
  abstract add(asset: AssetEntity): void;
  
  /** 
   * Checks if an asset exists in the repository
   * @param id - The unique identifier to check for
   * @returns true if the asset exists, false otherwise
   */
  abstract has(id: string): boolean;
  
  /** 
   * Retrieves an asset from the repository
   * @param assetID - The unique identifier of the asset to retrieve
   * @returns AssetEntity if found, undefined otherwise
   */
  abstract get(assetID: string): AssetEntity | undefined;
  
  /** 
   * Retrieves an existing asset or creates a new one if not found
   * Uses the asset factory to create new instances when needed
   * @param assetID - The unique identifier of the asset
   * @returns AssetEntity (either existing or newly created)
   */
  abstract getOrCreate(assetID: string): AssetEntity;
  
  /** 
   * Retrieves all assets currently stored in the repository
   * @returns Array of all AssetEntity instances
   */
  abstract getAll(): AssetEntity[];
  
  /** 
   * Removes an asset from the repository
   * @param assetID - The unique identifier of the asset to remove
   * Side effects: Triggers change notifications for UI updates
   */
  abstract remove(assetID: string): void;
  
  /** 
   * Factory method for creating new AssetEntity instances
   * Can be overridden or injected to customize asset creation behavior
   * @param id - The unique identifier for the new asset
   * @returns A new AssetEntity instance
   */
  abstract assetFactory(id: string): AssetEntity;
  
  /** 
   * Creates assets from external DTO data with recursive linked asset processing
   * Handles complex asset hierarchies by processing all linked assets recursively
   * @param dto - The asset data transfer object containing asset metadata and relationships
   * @returns The primary AssetEntity created from the DTO
   * Side effects: Creates and adds multiple assets if linked assets are present
   */
  abstract addFromDTO(dto: AssetDTO): AssetEntity;

  /** 
   * Retrieves the singleton AssetRepo from the host application objects
   * @param hostAppObjects - The application object repository to search
   * @returns AssetRepo instance or undefined if not found
   * Uses getSingletonComponent to ensure only one instance exists
   */
  static get(hostAppObjects: AppObjectRepo): AssetRepo | undefined {
    return getSingletonComponent(AssetRepo.type, hostAppObjects);
  }
}

/**
 * Factory function to create a new AssetRepo instance
 * @param appObj - The AppObject that will host this AssetRepo
 * @returns A new AssetRepo implementation instance
 */
export function makeAssetRepo(appObj: AppObject): AssetRepo {
  return new AssetRepositoryImp(appObj);
}

/**
 * Private implementation of AssetRepo that handles all concrete repository functionality.
 * 
 * Key Implementation Details:
 * - Uses Map for efficient asset lookup and storage
 * - Implements factory pattern with fallback to default asset creation
 * - Processes DTOs recursively to handle complex asset hierarchies
 * - Maintains referential integrity when mapping DTOs to entities
 * - Automatic singleton registration ensures global accessibility
 * 
 * DTO Processing Pattern:
 * The addFromDTO method recursively processes linked assets to ensure that
 * complex asset hierarchies are properly created and linked. This supports
 * scenarios where assets depend on other assets (e.g., 3D models with textures).
 * 
 * Factory Pattern Implementation:
 * The assetFactory method can be overridden or injected to customize how
 * assets are created, allowing for different asset types or initialization strategies.
 */
class AssetRepositoryImp extends AssetRepo {
  /** Internal storage for asset lookup using Map for O(1) access */
  private assetLookup = new Map<string, AssetEntity>();

  /** 
   * Checks if an asset exists in the repository
   * @param id - The asset ID to check for
   * @returns true if asset exists, false otherwise
   */
  has = (id: string): boolean => {
    return this.assetLookup.has(id);
  };

  /** 
   * Factory method for creating new AssetEntity instances
   * Logs an error if called without injection, then uses default factory
   * This allows for dependency injection of custom asset creation logic
   * @param id - The unique identifier for the new asset
   * @returns A new AssetEntity instance using the default factory
   */
  assetFactory = (id: string): AssetEntity => {
    this.error("Asset factory has not been injected");
    return makeAssetEntity(this.appObjects.getOrCreate(id));
  };

  /** 
   * Adds an asset to the repository if not already present
   * Prevents duplicate entries and maintains repository integrity
   * @param asset - The AssetEntity to add
   * Side effects: Triggers change notifications if asset was added
   */
  add = (asset: AssetEntity): void => {
    if (this.assetLookup.has(asset.id)) return;
    this.assetLookup.set(asset.id, asset);
    this.notifyOnChange();
  };

  /** 
   * Retrieves an asset from the repository
   * @param assetID - The unique identifier of the asset
   * @returns AssetEntity if found, undefined otherwise
   */
  get = (assetID: string): AssetEntity | undefined => {
    return this.assetLookup.get(assetID);
  };

  /** 
   * Retrieves an existing asset or creates a new one using the factory
   * This is the primary method for ensuring assets exist in the repository
   * @param assetID - The unique identifier of the asset
   * @returns AssetEntity (either existing or newly created)
   */
  getOrCreate = (assetID: string): AssetEntity => {
    const existing = this.assetLookup.get(assetID);
    if (existing) {
      return existing;
    }

    const newAsset = this.assetFactory(assetID);
    this.add(newAsset);
    return newAsset;
  };

  /** 
   * Retrieves all assets in the repository
   * Returns the values from the internal Map as an array
   * @returns Array of all AssetEntity instances
   */
  getAll = (): AssetEntity[] => {
    return Array.from(this.assetLookup.values());
  };

  /** 
   * Removes an asset from the repository if present
   * @param assetID - The unique identifier of the asset to remove
   * Side effects: Triggers change notifications if asset was removed
   */
  remove = (assetID: string) => {
    if (!this.assetLookup.has(assetID)) return;

    this.assetLookup.delete(assetID);
    this.notifyOnChange();
  };

  /** 
   * Creates assets from external DTO data with recursive linked asset processing
   * This method handles complex asset hierarchies by:
   * 1. Creating the primary asset from the DTO
   * 2. Recursively processing all linked assets
   * 3. Establishing relationships between assets
   * 
   * @param dto - The asset data transfer object containing metadata and relationships
   * @returns The primary AssetEntity created from the DTO
   * Side effects: Creates and adds multiple assets for complex hierarchies
   */
  addFromDTO(dto: AssetDTO): AssetEntity {
    const baseAsset = this.getOrCreate(dto.id);
    this.setAssetFromDTO(dto, baseAsset);

    const allLinkedDTOs: AssetDTO[] = [];
    this.addLinkedAssetDTOsRecursively(dto.linkedAssets, allLinkedDTOs);

    allLinkedDTOs.forEach((linkedDTO) => {
      const asset = this.getOrCreate(linkedDTO.id);
      this.setAssetFromDTO(linkedDTO, asset);
    });

    return baseAsset;
  }

  /** 
   * Recursively processes linked asset DTOs to build a flat list of all dependencies
   * This method traverses the entire asset hierarchy to ensure all linked assets
   * are processed regardless of nesting depth
   * 
   * @param linkedAssetList - Array of linked asset references with type and DTO
   * @param metaList - Accumulator array for collecting all linked DTOs
   * Side effects: Populates metaList with all linked DTOs found in the hierarchy
   */
  private addLinkedAssetDTOsRecursively(
    linkedAssetList: { type: string; asset: AssetDTO }[],
    metaList: AssetDTO[]
  ) {
    linkedAssetList.forEach((linkedAsset) => {
      metaList.push(linkedAsset.asset);
      this.addLinkedAssetDTOsRecursively(
        linkedAsset.asset.linkedAssets,
        metaList
      );
    });
  }

  /** 
   * Maps DTO properties to an AssetEntity instance
   * This method handles the conversion from external data format to internal entity state
   * Also establishes linked asset relationships
   * 
   * @param data - The DTO containing asset metadata
   * @param asset - The AssetEntity to populate with DTO data
   * @returns The populated AssetEntity for chaining
   * Side effects: Modifies asset properties and establishes linked asset relationships
   */
  private setAssetFromDTO = (data: AssetDTO, asset: AssetEntity) => {
    asset.description = data.description;
    asset.name = data.name;
    asset.archived = data.archived;
    asset.filename = data.filename;
    asset.owner = data.ownerId;
    asset.fileURL = data.fileURL;

    data.linkedAssets.forEach((linkedAsset) => {
      asset.addLinkedAsset(linkedAsset.type, linkedAsset.asset.id);
    });

    return asset;
  };

  /** 
   * Initializes the AssetRepo with singleton registration
   * @param appObj - The AppObject that will host this repository
   * Side effects: Registers this instance as a singleton for global access
   */
  constructor(appObj: AppObject) {
    super(appObj, AssetRepo.type);
    this.appObjects.registerSingleton(this);
  }
}
