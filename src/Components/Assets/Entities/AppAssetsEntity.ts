import { MemoizedBoolean, ObservableEntity } from '../../../Entities';
import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from '../../../HostAppObject';
import { AssetEntity } from './AssetEntity';

export abstract class AppAssetsEntity extends HostAppObjectEntity {
  static type = 'AppAssetsEntity';

  abstract getAll(): string[];
  abstract add(assetID: string): void;
  abstract has(assetID: string): boolean;
  abstract remove(assetID: string): void;

  abstract get editingAsset(): AssetEntity | undefined;
  abstract set editingAsset(val: AssetEntity | undefined);

  abstract get showArchived(): boolean;
  abstract set showArchived(show: boolean);

  static get(hostAppObjects: HostAppObjectRepo): AppAssetsEntity | undefined {
    return getSingletonComponent(AppAssetsEntity.type, hostAppObjects);
  }
}

export function makeAppAssets(appObj: HostAppObject): AppAssetsEntity {
  return new AppAssetsImp(appObj);
}

class AppAssetsImp extends AppAssetsEntity {
  private appAssets: string[] = [];

  private _editingAsset: AssetEntity | undefined;
  get editingAsset(): AssetEntity | undefined {
    return this._editingAsset;
  }

  set editingAsset(val: AssetEntity | undefined) {
    if (val?.id === this._editingAsset?.id) return;

    if (this._editingAsset) {
      this._editingAsset.removeChangeObserver(this.notifyOnChange);
    }

    this._editingAsset = val;

    if (this._editingAsset) {
      this._editingAsset.addChangeObserver(this.notifyOnChange);
    }

    this.notifyOnChange();
  }

  getAll = (): string[] => {
    return [...this.appAssets];
  };

  add = (assetID: string): void => {
    if (this.appAssets.includes(assetID)) return;

    this.appAssets.push(assetID);
    this.notifyOnChange();
  };

  has(assetID: string): boolean {
    return this.appAssets.includes(assetID);
  }

  remove(assetID: string): void {
    const index = this.appAssets.indexOf(assetID, 0);
    if (index > -1) {
      this.appAssets.splice(index, 1);
      this.notifyOnChange();
    }
  }

  private memoizedShowArchived = new MemoizedBoolean(false, this.notifyOnChange);
  get showArchived(): boolean {
    return this.memoizedShowArchived.val;
  }
  set showArchived(show: boolean) {
    this.memoizedShowArchived.val = show;
  }

  constructor(appObj: HostAppObject) {
    super(appObj, AppAssetsEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
