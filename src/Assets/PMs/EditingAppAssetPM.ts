import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";

export interface EditingAppAssetVM {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  filename: string;
}

export abstract class EditingAppAssetPM extends AppObjectPM<
  EditingAppAssetVM | undefined
> {
  static type = "EditingAppAssetPM";

  static get(appObjects: AppObjectRepo): EditingAppAssetPM | undefined {
    return getSingletonComponent(EditingAppAssetPM.type, appObjects);
  }
}

export function makeEditingAppAssetPM(appObject: AppObject): EditingAppAssetPM {
  return new EditingAppAssetPMImp(appObject);
}

class EditingAppAssetPMImp extends EditingAppAssetPM {
  private appAssets?: AppAssetsEntity;

  vmsAreEqual(
    a: EditingAppAssetVM | undefined,
    b: EditingAppAssetVM | undefined
  ): boolean {
    if (a === undefined && b === undefined) return true;

    if (a?.archived !== b?.archived) return false;
    if (a?.description !== b?.description) return false;
    if (a?.filename !== b?.filename) return false;
    if (a?.id !== b?.id) return false;
    if (a?.name !== b?.name) return false;

    return true;
  }

  private onAssetChange = () => {
    if (!this.appAssets) return;

    if (this.appAssets.editingAsset) {
      const {
        id,
        name,
        description,
        archived,
        filename
      } = this.appAssets.editingAsset;
      const vm: EditingAppAssetVM = {
        id,
        name,
        description,
        archived,
        filename
      };
      this.doUpdateView(vm);
    } else {
      this.doUpdateView(undefined);
    }
  };

  constructor(appObject: AppObject) {
    super(appObject, EditingAppAssetPM.type);

    this.appAssets = appObject.getComponent<AppAssetsEntity>(
      AppAssetsEntity.type
    );
    if (!this.appAssets) {
      this.warn(
        "PM has been added to an App Object without an AppAssetsEntity"
      );
      return;
    }

    this.appObjects.registerSingleton(this);

    this.appAssets.addChangeObserver(this.onAssetChange);
    this.onAssetChange();
  }
}
