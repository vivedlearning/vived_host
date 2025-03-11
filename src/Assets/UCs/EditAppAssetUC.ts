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

export abstract class EditAppAssetUC extends AppObjectUC {
  static type = "EditAppAssetUC";

  abstract editAsset(assetID: string): void;

  static get(appObjects: AppObjectRepo): EditAppAssetUC | undefined {
    return getSingletonComponent<EditAppAssetUC>(
      EditAppAssetUC.type,
      appObjects
    );
  }
}

export function makeEditAppAsset(appObject: AppObject): EditAppAssetUC {
  return new GetAssetUCImp(appObject);
}

class GetAssetUCImp extends EditAppAssetUC {
  private assetRepo?: AssetRepo;

  private get appAssets() {
    return this.getCachedSingleton<AppAssetsEntity>(AppAssetsEntity.type);
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  editAsset = (assetID: string): void => {
    if (!this.assetRepo || !this.appAssets || !this.sandbox) return;

    const asset = this.assetRepo.get(assetID);
    if (!asset) {
      this.warn("Unable to find asset by id: " + assetID);
      return;
    }

    this.appAssets.editingAsset = asset;
    this.sandbox.state = SandboxState.EDIT_ASSET;
  };

  constructor(appObject: AppObject) {
    super(appObject, EditAppAssetUC.type);

    this.appObjects.registerSingleton(this);

    this.assetRepo = appObject.getComponent<AssetRepo>(AssetRepo.type);
    if (!this.assetRepo) {
      this.error("UC added to an App Object that does not have AssetRepo");
      return;
    }
  }
}
