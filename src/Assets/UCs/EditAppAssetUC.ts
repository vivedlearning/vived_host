/**
 * EditAppAssetUC.ts
 *
 * This use case handles initiating the asset editing workflow by transitioning
 * the application to editing mode for a specific asset.
 *
 * Key Concepts:
 * - Manages application state transitions for asset editing workflows
 * - Sets the editing context in AppAssetsEntity for UI components
 * - Transitions sandbox state to enable editing interfaces
 * - Validates asset existence before initiating editing
 * - Provides error handling for missing assets or dependencies
 *
 * Usage Patterns:
 * - Singleton use case accessed through static get() method
 * - Called with asset ID to initiate editing for specific assets
 * - Coordinates between asset repository, app assets entity, and sandbox state
 * - Used by controllers to start editing workflows from UI interactions
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import {
  AppSandboxEntity,
  SandboxState
} from "../../AppSandbox/Entities/AppSandboxEntity";
import { AppAssetsEntity, AssetRepo } from "../Entities";

/**
 * EditAppAssetUC handles initiating asset editing workflows and state transitions.
 *
 * This singleton use case manages the transition from normal asset viewing
 * to editing mode, setting up the necessary context for editing interfaces.
 */
export abstract class EditAppAssetUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "EditAppAssetUC";

  /**
   * Initiates editing mode for the specified asset.
   *
   * @param assetID - The unique identifier of the asset to edit
   */
  abstract editAsset(assetID: string): void;

  /**
   * Retrieves the singleton EditAppAssetUC instance.
   *
   * @param appObjects - Repository for accessing the singleton component
   * @returns EditAppAssetUC instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo): EditAppAssetUC | undefined {
    return getSingletonComponent<EditAppAssetUC>(
      EditAppAssetUC.type,
      appObjects
    );
  }
}

/**
 * Factory function to create a new EditAppAssetUC instance.
 *
 * @param appObject - The AppObject that will host this singleton use case (must have AssetRepo)
 * @returns A new EditAppAssetUC implementation instance
 */
export function makeEditAppAsset(appObject: AppObject): EditAppAssetUC {
  return new GetAssetUCImp(appObject);
}

/**
 * Private implementation of EditAppAssetUC that handles state transitions for asset editing.
 *
 * Key Implementation Details:
 * - Validates asset existence in repository before initiating editing
 * - Sets editing context in AppAssetsEntity for UI component access
 * - Transitions sandbox state to enable editing interfaces
 * - Provides warning logs for missing assets or invalid operations
 * - Validates required dependencies during initialization
 */
class GetAssetUCImp extends EditAppAssetUC {
  /** The asset repository for asset lookup and validation */
  private assetRepo?: AssetRepo;

  /** Gets the app assets entity for setting editing context */
  private get appAssets() {
    return this.getCachedSingleton<AppAssetsEntity>(AppAssetsEntity.type);
  }

  /** Gets the sandbox entity for managing application state transitions */
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  /**
   * Initiates asset editing by setting up editing context and transitioning state.
   *
   * This method handles the complete editing initiation workflow:
   * 1. Validates required dependencies are available
   * 2. Looks up the asset in the repository
   * 3. Sets the editing context in AppAssetsEntity
   * 4. Transitions sandbox state to editing mode
   * 5. Provides appropriate warnings for missing assets
   *
   * @param assetID - The unique identifier of the asset to edit
   */
  editAsset = (assetID: string): void => {
    if (!this.assetRepo || !this.appAssets || !this.sandbox) return;

    const asset = this.assetRepo.get(assetID);
    if (!asset) {
      this.warn("Unable to find asset by id: " + assetID);
      return;
    }

    // Set editing context and transition to editing state
    this.appAssets.editingAsset = asset;
    this.sandbox.state = SandboxState.EDIT_ASSET;
  };

  /**
   * Initializes the EditAppAssetUC with required dependencies and validation.
   *
   * @param appObject - The AppObject that should contain the AssetRepo for asset lookup
   */
  constructor(appObject: AppObject) {
    super(appObject, EditAppAssetUC.type);
    this.appObjects.registerSingleton(this);

    // Validate and cache the asset repository dependency
    this.assetRepo = appObject.getComponent<AssetRepo>(AssetRepo.type);
    if (!this.assetRepo) {
      this.error("UC added to an App Object that does not have AssetRepo");
      return;
    }
  }
}
