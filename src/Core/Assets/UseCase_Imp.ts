import * as BOUNDARY from "./Boundary";
import * as ENTITIES from "./Entities";
import {
  AppFileVersionError,
  AssetHasNotBeenLoadedError,
  DuplicateAssetID,
  EmptyAssetIDError,
  InvalidAssetID,
} from "./Errors";
import {
  convertAssetFile_EntityToBoundary,
  convertAsset_BoundaryToEntity,
  convertAsset_EntityToBoundary,
} from "./Utilities";

export class AssetUCImp implements BOUNDARY.AssetUC {
  private assetLookup = new Map<string, ENTITIES.Asset>();
  
  private assetFetcher: (url: string) => Promise<string>;

  constructor(assetFetcher: (url: string) => Promise<string>) {
    this.assetFetcher = assetFetcher;
  }

  releaseAllBlobs = (): void => {
    this.assetLookup.forEach((asset, id)=>{
      asset.files.forEach((file,i)=>{
        if(file.blobUrl)
        {
          URL.revokeObjectURL(file.blobUrl);
          asset.files[i].blobUrl = undefined;
        }
      })

      this.assetLookup.set(id, asset);
    })
  }

  getFileBlobURL = (assetID: string, version?: number): string => {
    const assetFile = this.getAssetFile(assetID, version);

    if(!assetFile)
    {
      return ""
    }

    if(!assetFile.blobUrl)
    {
      throw new AssetHasNotBeenLoadedError(assetID, assetFile.version);
    }

    return assetFile?.blobUrl ?? "";
  }

  isFileLoaded = (assetID: string, version?: number): boolean => {
    const assetFile = this.getAssetFile(assetID, version);
    return assetFile?.blobUrl ? true : false;
  }

  loadFile = (assetID: string, version?: number): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const assetFile = this.getAssetFile(assetID, version);

      if (!assetFile) {
        reject();
        return;
      }

      if(assetFile.blobUrl)
      {
        resolve();
        return;
      }

      this.assetFetcher(assetFile?.url)
        .then((assetBlobURL) => {
          this.setAssetFileBlob(assetID, assetFile.version, assetBlobURL);
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  getAllAssets = (): BOUNDARY.Asset[] => {
    const assetDatas: BOUNDARY.Asset[] = [];
    this.assetLookup.forEach((asset) => {
      assetDatas.push(convertAsset_EntityToBoundary(asset));
    });

    return assetDatas;
  }

  getAssetFileVerion = (
    assetID: string,
    version: number
  ): BOUNDARY.AssetFile | undefined => {
    const entity = this.getEntity(assetID);

    if (!entity) {
      return;
    }

    let assetFile: ENTITIES.AssetFile | undefined;
    entity.files.forEach((file) => {
      if (file.version === version) {
        assetFile = file;
      }
    });

    if (assetFile) {
      return convertAssetFile_EntityToBoundary(assetFile);
    } else {
      throw new AppFileVersionError(assetID, version);
    }
  }

  getLatestVersionNumber = (
    assetID: string,
    includeDrafts: boolean = false
  ): number | undefined => {
    const entity = this.getEntity(assetID);

    if (!entity) {
      return;
    }

    let latestVersion = -1;

    entity.files.forEach((file) => {
      const versionIsHigher = file.version > latestVersion;
      const statusIsGood = includeDrafts ? true : file.status === "PUBLISHED";

      if (versionIsHigher && statusIsGood) {
        latestVersion = file.version;
      }
    });

    if (latestVersion >= 0) {
      return latestVersion;
    }
  }

  getAssetsByType = (
    type: BOUNDARY.AssetType,
    withTags?: string[]
  ): BOUNDARY.Asset[] => {
    const assetDatas: BOUNDARY.Asset[] = [];

    this.assetLookup.forEach((asset) => {
      const isType = this.isAssetType(asset, type);
      const hasTag = withTags ? this.assetHasTags(asset, withTags) : true;

      if (isType && hasTag) {
        assetDatas.push(convertAsset_EntityToBoundary(asset));
      }
    });
    return assetDatas;
  }

  getAsset = (id: string): BOUNDARY.Asset | undefined => {
    const entity = this.getEntity(id);

    if (entity) {
      return convertAsset_EntityToBoundary(entity);
    }
  }

  addAsset = (assetData: BOUNDARY.Asset): void => {
    if (this.assetLookup.has(assetData.id)) {
      throw new DuplicateAssetID(assetData.id);
    }

    if (!assetData.id) {
      throw new EmptyAssetIDError();
    }

    const entity = convertAsset_BoundaryToEntity(assetData);
    this.assetLookup.set(entity.id, entity);
  }

  addManyAssets = (assetDatas: BOUNDARY.Asset[]): void => {
    const newIds: string[] = [];
    assetDatas.forEach((assetData) => {
      const id = assetData.id;
      if (newIds.includes(id) || this.assetLookup.has(id)) {
        throw new DuplicateAssetID(id);
      } else {
        newIds.push(id);
      }
    });

    assetDatas.forEach((assetData) => {
      this.addAsset(assetData);
    });
  }

  private getAssetFile(
    assetID: string,
    version?: number
  ): ENTITIES.AssetFile | undefined {
    const asset = this.getAsset(assetID);
    if(!asset)
    {
      return undefined;
    }

    const versionToUse = version ?? this.getLatestVersionNumber(assetID);
    if(!versionToUse)
    {
      return undefined;
    }

    let rVal: ENTITIES.AssetFile | undefined;
    asset.files.forEach((file) => {
      if (file.version === versionToUse) {
        rVal = file;
      }
    });

    if (!rVal) {
      throw new AppFileVersionError(asset.id, versionToUse);
    }

    return rVal;
  }

  private setAssetFileBlob(assetID: string, version: number, blobURL: string) {
    const entity = this.getAsset(assetID);
    if (!entity) {
      return;
    }

    entity.files.forEach((file, i) => {
      if (version === file.version) {
        entity.files[i].blobUrl = blobURL;
      }
    });

    this.assetLookup.set(assetID, entity);
  }

  private getEntity(id: string): ENTITIES.Asset | undefined {
    if (!this.assetLookup.has(id)) {
      throw new InvalidAssetID(id);
    }

    return this.assetLookup.get(id);
  }

  private isAssetType(
    asset: ENTITIES.Asset,
    type: ENTITIES.AssetType
  ): boolean {
    return asset.type === type;
  }

  private assetHasTags(asset: ENTITIES.Asset, tags: string[]): boolean {

    for (const tag of tags) {
      if (asset.tags.includes(tag)) {
        return true;
      }
    }
    return false;
  }
}
