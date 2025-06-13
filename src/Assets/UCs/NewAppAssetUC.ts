/**
 * NewAppAssetUC.ts
 * 
 * This use case handles creation of new assets within application contexts,
 * managing the complete workflow from file upload to UI state transitions.
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { AppSandboxEntity, SandboxState } from "../../AppSandbox/Entities";
import {
  DialogAlertDTO,
  MakeAlertDialogUC,
  MakeSpinnerDialogUC
} from "../../Dialog";
import { NewAssetApiDto, PostNewAssetUC } from "../../VivedAPI/UCs";
import { AppAssetsEntity, AssetRepo } from "../Entities";

/**
 * Data transfer object for new application asset creation requests.
 */
export interface NewAppAssetDTO {
  /** The file object to be uploaded and stored as the asset */
  file: File;
  /** Display name for the asset */
  name: string;
  /** Detailed description of the asset's purpose or content */
  description: string;
}

/**
 * NewAppAssetUC handles creation of new assets within application contexts.
 * 
 * This singleton use case manages asset creation with UI feedback and state transitions.
 */
export abstract class NewAppAssetUC extends AppObjectUC {
  /** Static type identifier for component registration */
  static type = "NewAppAssetUC";

  /**
   * Creates a new asset with the provided data.
   * 
   * @param data - Complete asset information including file and metadata
   * @returns Promise that resolves when the asset is successfully created
   */
  abstract create(data: NewAppAssetDTO): Promise<void>;

  /**
   * Retrieves the singleton NewAppAssetUC instance.
   * 
   * @param appObjects - Repository for accessing the singleton component
   * @returns NewAppAssetUC instance or undefined if not found
   */
  static get(appObjects: AppObjectRepo): NewAppAssetUC | undefined {
    return getSingletonComponent(NewAppAssetUC.type, appObjects);
  }
}

/**
 * Factory function to create a new NewAppAssetUC instance.
 * 
 * @param appObject - The AppObject that will host this singleton use case
 * @returns A new NewAppAssetUC implementation instance
 */
export function makeNewAppAssetUC(appObject: AppObject): NewAppAssetUC {
  return new NewAppAssetUCImp(appObject);
}

/**
 * Private implementation of NewAppAssetUC with app context and state management.
 */
class NewAppAssetUCImp extends NewAppAssetUC {
  private appAssets?: AppAssetsEntity;

  private get postNewAsset() {
    return this.getCachedSingleton<PostNewAssetUC>(PostNewAssetUC.type)?.doPost;
  }

  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  private get spinnerFactory() {
    return this.getCachedSingleton<MakeSpinnerDialogUC>(
      MakeSpinnerDialogUC.type
    );
  }

  private get alertFactory() {
    return this.getCachedSingleton<MakeAlertDialogUC>(MakeAlertDialogUC.type);
  }

  create = (data: NewAppAssetDTO): Promise<void> => {
    const appAssets = this.appAssets;
    const postNewAsset = this.postNewAsset;
    const sandbox = this.sandbox;
    const assetRepo = this.assetRepo;

    if (!appAssets || !postNewAsset || !sandbox || !assetRepo) {
      return Promise.reject();
    }

    return new Promise<void>((resolve) => {
      const { description, file, name } = data;

      const newAssetData: NewAssetApiDto = {
        description,
        name,
        file,
        ownerID: sandbox.appID
      };

      const spinnerDialog = this.spinnerFactory?.make({
        title: "New App Asset",
        message: "Posting new app asset..."
      });

      postNewAsset(newAssetData)
        .then((resp) => {
          appAssets.add(resp.id);

          const newAsset = assetRepo.assetFactory(resp.id);
          newAsset.setFile(file);
          newAsset.description = description;
          newAsset.name = name;
          newAsset.filename = resp.filename;

          assetRepo.add(newAsset);
          this.sandbox!.state = SandboxState.MOUNTED;

          spinnerDialog?.close();
          resolve();
        })
        .catch((e: Error) => {
          this.error("create new asset error: " + e.message);
          spinnerDialog?.close();

          const dialogDTO: DialogAlertDTO = {
            buttonLabel: "OK",
            message: `Something went wrong when creating a new app asset. Check the console. ${e.message}`,
            title: "New App Asset Error"
          };
          this.alertFactory?.make(dialogDTO);

          resolve();
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, NewAppAssetUC.type);
    this.appObjects.registerSingleton(this);

    this.appAssets = appObject.getComponent<AppAssetsEntity>(
      AppAssetsEntity.type
    );
    if (!this.appAssets) {
      this.error(
        "UC added to an App Object that does not have AppAssetsEntity"
      );
      return;
    }
  }
}
