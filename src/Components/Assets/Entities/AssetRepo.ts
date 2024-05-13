import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from '../../../HostAppObject';
import { AssetEntity, makeAssetEntity } from './AssetEntity';

export interface AssetDTO {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  archived: boolean;
  filename: string;
  fileURL: string;
  linkedAssets: { type: string; asset: AssetDTO }[];
}

export abstract class AssetRepo extends HostAppObjectEntity {
  static type = 'AssetRepository';

  abstract add(asset: AssetEntity): void;
  abstract has(id: string): boolean;
  abstract get(assetID: string): AssetEntity | undefined;
  abstract getOrCreate(assetID: string): AssetEntity;
  abstract getAll(): AssetEntity[];
  abstract remove(assetID: string): void;
  abstract assetFactory(id: string): AssetEntity;
  abstract addFromDTO(dto: AssetDTO): AssetEntity;

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
  };

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
  };

  getAll = (): AssetEntity[] => {
    return Array.from(this.assetLookup.values());
  };

  remove = (assetID: string) => {
    if (!this.assetLookup.has(assetID)) return;

    this.assetLookup.delete(assetID);
    this.notifyOnChange();
  };

  addFromDTO(dto: AssetDTO): AssetEntity {
    const baseAsset = this.getOrCreate(dto.id);
    this.setAssetFromDTO(dto, baseAsset);

    const allLinkedDTOs: AssetDTO[] = [];
    this.addLinkedAssetDTOsRecursively(dto.linkedAssets, allLinkedDTOs);

    allLinkedDTOs.forEach((linkedDTO) => {
      const asset = this.getOrCreate(linkedDTO.id);
      this.setAssetFromDTO(linkedDTO, asset);
    });

    return baseAsset;
  }

  private addLinkedAssetDTOsRecursively(linkedAssetList: { type: string; asset: AssetDTO }[], metaList: AssetDTO[]) {
    linkedAssetList.forEach((linkedAsset) => {
      metaList.push(linkedAsset.asset);
      this.addLinkedAssetDTOsRecursively(linkedAsset.asset.linkedAssets, metaList);
    });
  }

  private setAssetFromDTO = (data: AssetDTO, asset: AssetEntity) => {
    asset.description = data.description;
    asset.name = data.name;
    asset.archived = data.archived;
    asset.filename = data.filename;
    asset.owner = data.ownerId;
    asset.fileURL = data.fileURL;

    data.linkedAssets.forEach((linkedAsset) => {
      asset.addLinkedAsset(linkedAsset.type, linkedAsset.asset.id);
    });

    return asset;
  };

  constructor(appObj: HostAppObject) {
    super(appObj, AssetRepo.type);
    this.appObjects.registerSingleton(this);
  }
}
