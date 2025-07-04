import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";

export abstract class ShowArchivedAppAssetPM extends AppObjectPM<boolean> {
  static type = "ShowArchivedAppAssetPM";

  static get(appObjects: AppObjectRepo): ShowArchivedAppAssetPM | undefined {
    return getSingletonComponent(ShowArchivedAppAssetPM.type, appObjects);
  }
}

export function makeShowArchivedAppAssetPM(
  appObject: AppObject
): ShowArchivedAppAssetPM {
  return new ShowArchivedAppAssetPMImp(appObject);
}

class ShowArchivedAppAssetPMImp extends ShowArchivedAppAssetPM {
  private appAssets?: AppAssetsEntity;

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  private onAssetChange = () => {
    if (!this.appAssets) return;
    this.doUpdateView(this.appAssets.showArchived);
  };

  constructor(appObject: AppObject) {
    super(appObject, ShowArchivedAppAssetPM.type);

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
