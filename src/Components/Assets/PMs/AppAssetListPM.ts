import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";
import { AssetRepo } from "../Entities/AssetRepo";

export abstract class AppAssetListPM extends AppObjectPM<string[]> {
  static type = "AppAssetListPM";

  static get(appObjects: AppObjectRepo): AppAssetListPM | undefined {
    return getSingletonComponent(AppAssetListPM.type, appObjects);
  }
}

export function makeAppAssetListPM(appObject: AppObject): AppAssetListPM {
  return new AppAssetListPMImp(appObject);
}

class AppAssetListPMImp extends AppAssetListPM {
  private appAssets?: AppAssetsEntity;

  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  vmsAreEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;

    let listsAreEqual = true;
    a.forEach((aID, i) => {
      const bID = b[i];
      if (bID !== aID) {
        listsAreEqual = false;
      }
    });

    return listsAreEqual;
  }

  private onAppAssetsChange = () => {
    if (!this.appAssets) return;
    const allAppAssets = this.appAssets.getAll();

    if (this.appAssets.showArchived) {
      this.doUpdateView(allAppAssets);
      return;
    }

    const nonArchivedAssets: string[] = [];

    allAppAssets.forEach((assetID) => {
      const asset = this.assetRepo?.get(assetID);
      if (asset && asset.archived === false) {
        nonArchivedAssets.push(assetID);
      }
    });

    this.doUpdateView(nonArchivedAssets);
  };

  constructor(appObject: AppObject) {
    super(appObject, AppAssetListPM.type);

    this.appAssets = appObject.getComponent<AppAssetsEntity>(
      AppAssetsEntity.type
    );
    if (!this.appAssets) {
      this.error(
        "PM has been added to an app object without an AppAssetsEntity"
      );
      return;
    }

    this.appAssets.addChangeObserver(this.onAppAssetsChange);

    this.appObjects.registerSingleton(this);

    this.onAppAssetsChange();
  }
}
