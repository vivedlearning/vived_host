import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from '../../../HostAppObject';
import { AssetEntity, makeAssetEntity } from './AssetEntity';

export abstract class AssetRepo extends HostAppObjectEntity {
  static type = 'AssetRepository';

  abstract add(asset: AssetEntity): void;
  abstract has(id: string): boolean;
  abstract get(assetID: string): AssetEntity | undefined;
  abstract getOrCreate(assetID: string): AssetEntity;
  abstract getAll(): AssetEntity[];
  abstract getAssetsForOwner(ownerID: string): AssetEntity[];
  abstract remove(assetID: string): void;
  abstract assetFactory(id: string): AssetEntity;

  static get(hostAppObjects: HostAppObjectRepo): AssetRepo | undefined {
    return getSingletonComponent(AssetRepo.type, hostAppObjects);
  }
}

export function makeAssetRepo(appObj: HostAppObject): AssetRepo {
  return new AssetRepositoryImp(appObj);
}

class AssetRepositoryImp extends AssetRepo {
  private assetLookup = new Map<string, AssetEntity>();

  has = (id: string): boolean => {
    return this.assetLookup.has(id);
  };

  assetFactory = (id: string): AssetEntity => {
    this.error('Asset factory has not been injected');
    return makeAssetEntity(this.appObjects.getOrCreate(id));
  }

  add = (asset: AssetEntity): void => {
    if (this.assetLookup.has(asset.id)) return;
    this.assetLookup.set(asset.id, asset);
    this.notifyOnChange();
  };

  get = (assetID: string): AssetEntity | undefined => {
    return this.assetLookup.get(assetID);
  };

  getOrCreate = (assetID: string): AssetEntity => {
    const existing = this.assetLookup.get(assetID);
    if (existing) {
      return existing;
    }

    const newAsset = this.assetFactory(assetID);
    this.add(newAsset);
    return newAsset;
  }

  getAll = (): AssetEntity[] => {
    return Array.from(this.assetLookup.values());
  }

  getAssetsForOwner = (ownerID: string): AssetEntity[] => {
    const ownerAssets: AssetEntity[] = [];

    this.assetLookup.forEach((asset) => {
      if (asset.owner === ownerID) {
        ownerAssets.push(asset);
      }
    });

    return ownerAssets;
  };

  remove = (assetID: string) => {
    if (!this.assetLookup.has(assetID)) return;

    this.assetLookup.delete(assetID);
    this.notifyOnChange();
  }

  constructor(appObj: HostAppObject) {
    super(appObj, AssetRepo.type);
    this.appObjects.registerSingleton(this);
  }
}
