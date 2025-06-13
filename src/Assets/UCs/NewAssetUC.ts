/**
 * NewAssetUC.ts
 * 
 * This use case handles the creation of new assets, managing the complete workflow
 * from file upload through API persistence to local entity creation and storage.
 * 
 * Key Concepts:
 * - Singleton use case that handles asset creation operations
 * - Coordinates file upload with metadata persistence via API
 * - Creates and configures new asset entities in the local repository
 * - Transforms between DTO formats for API and internal use
 * - Provides unique asset IDs for tracking and reference
 * 
 * Usage Patterns:
 * - Accessed as a singleton through static get() method
 * - Called with complete asset data including file and metadata
 * - Returns asset ID for immediate reference by calling code
 * - Handles async operations with proper error propagation
 */

import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  getSingletonComponent
} from "@vived/core";
import { NewAssetApiDto, PostNewAssetUC } from "../../VivedAPI/UCs";
import { AssetRepo } from "../Entities";

/**
 * Data transfer object for new asset creation requests.
 * Contains all necessary information to create a new asset in the system.
 */
export interface NewAssetDto {
  /** The file object to be uploaded and stored as the asset */
  file: File;
  /** Display name for the asset */
  name: string;
  /** Detailed description of the asset's purpose or content */
  description: string;
  /** ID of the user or entity that owns this asset */
  owner: string;
}

/**
 * NewAssetUC handles the creation of new assets in the VIVED system.
 * 
 * This singleton use case manages the complete asset creation workflow,
 * from initial file upload through API persistence to local entity creation.
 */
export abstract class NewAssetUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "NewAssetUC";

  /**
   * Creates a new asset with the provided data.
   * 
   * @param data - Complete asset information including file and metadata
   * @returns Promise resolving to the unique ID of the newly created asset
   */
  abstract create(data: NewAssetDto): Promise<string>;

  /**
   * Retrieves the singleton NewAssetUC instance.
   * 
   * @param appObjects - Repository for accessing the singleton component
   * @returns NewAssetUC instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo): NewAssetUC | undefined {
    return getSingletonComponent(NewAssetUC.type, appObjects);
  }
}

/**
 * Factory function to create a new NewAssetUC instance.
 * 
 * @param appObject - The AppObject that will host this singleton use case
 * @returns A new NewAssetUC implementation instance
 */
export function makeNewAssetUC(appObject: AppObject): NewAssetUC {
  return new NewAssetUCImp(appObject);
}

/**
 * Private implementation of NewAssetUC that handles the concrete asset creation operations.
 * 
 * Key Implementation Details:
 * - Validates required dependencies (API and repository components)
 * - Transforms NewAssetDto to NewAssetApiDto for API communication
 * - Creates and configures new asset entities with file and metadata
 * - Adds created assets to the repository for management and access
 * - Handles async operations with proper error propagation
 * - Registers itself as a singleton for system-wide access
 */
class NewAssetUCImp extends NewAssetUC {
  /** 
   * Gets the API use case for posting new assets to the backend
   * Cached for efficient repeated access during operations
   */
  private get postNewAsset() {
    return this.getCachedSingleton<PostNewAssetUC>(PostNewAssetUC.type)?.doPost;
  }

  /** 
   * Gets the asset repository for entity creation and management
   * Cached for efficient repeated access during operations
   */
  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  /**
   * Creates a new asset with complete workflow handling.
   * 
   * This method handles the complete asset creation process:
   * 1. Validates required dependencies are available
   * 2. Transforms the DTO to API format
   * 3. Posts the asset data to the backend API
   * 4. Creates a new asset entity with the returned information
   * 5. Configures the entity with file and metadata
   * 6. Adds the entity to the repository for management
   * 
   * @param data - Complete asset creation data
   * @returns Promise resolving to the unique asset ID
   */
  create = (data: NewAssetDto): Promise<string> => {
    const postNewAsset = this.postNewAsset;
    const assetRepo = this.assetRepo;

    if (!postNewAsset || !assetRepo) {
      return Promise.reject(new Error("Missing dependencies"));
    }

    const { description, file, name, owner } = data;
    const newAssetData: NewAssetApiDto = {
      description,
      name,
      file,
      ownerID: owner
    };

    return postNewAsset(newAssetData).then((resp) => {
      // Create and configure the new asset entity
      const newAsset = assetRepo.assetFactory(resp.id);
      newAsset.setFile(file);
      newAsset.description = description;
      newAsset.name = name;
      newAsset.filename = resp.filename;

      // Add to repository for management
      assetRepo.add(newAsset);
      return resp.id;
    });
  };

  /**
   * Initializes the NewAssetUC and registers it as a singleton.
   * 
   * @param appObject - The AppObject that will host this singleton use case
   */
  constructor(appObject: AppObject) {
    super(appObject, NewAssetUC.type);
    this.appObjects.registerSingleton(this);
  }
}
