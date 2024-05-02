import { getSingletonComponent, HostAppObject, HostAppObjectPM, HostAppObjectRepo } from '../../../HostAppObject';
import { AppAssetsEntity } from '../Entities/AppAssetsEntity';

export class AppAssetListPM extends HostAppObjectPM<string[]> {
  static type = 'AppAssetListPM';

  static get(appObjects: HostAppObjectRepo): AppAssetListPM | undefined {
    return getSingletonComponent(AppAssetListPM.type, appObjects);
  }

  private appAssets?: AppAssetsEntity;

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
    const assetIDs = this.appAssets.getAll();
    this.doUpdateView(assetIDs);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, AppAssetListPM.type);

    this.appAssets = appObject.getComponent<AppAssetsEntity>(AppAssetsEntity.type);
    if (!this.appAssets) {
      this.error('PM has been added to an app object without an AppAssetsEntity');
      return;
    }

    this.appAssets.addChangeObserver(this.onAppAssetsChange);

    this.appObjects.registerSingleton(this);

    this.onAppAssetsChange();
  }
}
