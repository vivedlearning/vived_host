import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { AssetEntity } from "../Entities/AssetEntity";

export interface AssetVM {
  id: string;
  name: string;
  description: string;
  archived: boolean;
}

export abstract class AssetPM extends AppObjectPM<AssetVM> {
  static type = "AssetPM";

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

export function makeAssetPM(appObject: AppObject): AssetPM {
  return new AssetPMImp(appObject);
}

class AssetPMImp extends AssetPM {
  private asset?: AssetEntity;

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
