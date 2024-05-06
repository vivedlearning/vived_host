import { AssetDTO, NewAssetDTO, UpdateAssetDTO } from '../../../Entities';
import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from '../../../HostAppObject';
import { AssetEntity, makeAssetEntity } from './AssetEntity';

export interface APIComms {
  getAssetFile: (assetID: string) => Promise<File>;
  getAssetMeta: (assetID: string) => Promise<AssetDTO>;
  getAssetsForOwner: (ownerID: string) => Promise<AssetDTO[]>;
  updateArchiveAsset: (assetID: string, archived: boolean) => Promise<void>;
  updateAssetMeta: (data: AssetDTO) => Promise<void>;
  createNewAsset: (data: NewAssetDTO) => Promise<string>;
  updateAssetFile: (assetID: string, file: File) => Promise<void>;
  deleteAsset: (assetID: string) => Promise<void>;
  updateAsset: (data: UpdateAssetDTO) => Promise<AssetDTO>;
}

export abstract class AssetRepo extends HostAppObjectEntity {
  static type = 'AssetRepository';

  abstract set apiComms(comms: APIComms);

  abstract addAsset(asset: AssetEntity): void;
  abstract hasAsset(id: string): boolean;
  abstract hasFetchedAsset(assetID: string): boolean;
  abstract getFetchedAsset(assetID: string): AssetEntity | undefined;
  abstract getAsset(assetID: string): Promise<AssetEntity>;
  abstract getAssetBlobURL(assetID: string): Promise<string>;
  abstract getAssetsForOwner(ownerID: string): Promise<AssetEntity[]>;
  abstract setAssetArchived(assetID: string, archive: boolean): Promise<void>;
  abstract updateAssetMeta(data: AssetDTO): Promise<void>;
  abstract newAsset(data: NewAssetDTO): Promise<AssetEntity>;
  abstract updateAssetFile(assetID: string, file: File): Promise<void>;
  abstract deleteAsset(assetID: string): Promise<void>;
  abstract updateAsset(data: UpdateAssetDTO): Promise<AssetDTO>;
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
  private _apiComms?: APIComms;

  set apiComms(comms: APIComms) {
    this._apiComms = comms;
  }

  hasAsset = (id: string): boolean => {
    return this.assetLookup.has(id);
  };

  assetFactory(id: string): AssetEntity {
    throw new Error('Asset factory has not been injected');
  }

  updateAsset = (data: UpdateAssetDTO): Promise<AssetDTO> => {
    if (!this._apiComms) {
      return Promise.reject(NO_API_COMMS_ERROR);
    }

    const asset = this.assetLookup.get(data.id);
    if (!asset) {
      return Promise.reject(NO_ASSET_ERROR);
    }

    return new Promise<AssetDTO>((resolve, reject) => {
      this._apiComms!.updateAsset(data)
        .then((updatedAsset) => {
          asset.name = updatedAsset.name;
          asset.description = updatedAsset.description;
          asset.archived = updatedAsset.archived;

          resolve(updatedAsset);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  updateAssetMeta = (data: AssetDTO): Promise<void> => {
    if (!this._apiComms) {
      return Promise.reject(NO_API_COMMS_ERROR);
    }

    const asset = this.assetLookup.get(data.id);
    if (!asset) {
      return Promise.reject(NO_ASSET_ERROR);
    }

    if (asset.name === data.name && ((asset.description === data.description) === asset.archived) === data.archived) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      this._apiComms!.updateAssetMeta(data)
        .then((_) => {
          asset.name = data.name;
          asset.description = data.description;
          asset.archived = data.archived;
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  hasFetchedAsset = (assetID: string): boolean => {
    return this.assetLookup.has(assetID);
  };

  getFetchedAsset = (assetID: string): AssetEntity | undefined => {
    return this.assetLookup.get(assetID);
  };

  getAssetBlobURL = (assetID: string): Promise<string> => {
    if (!this._apiComms) {
      return Promise.reject(NO_API_COMMS_ERROR);
    }

    const existingAsset = this.assetLookup.get(assetID);

    if (existingAsset) {
      if (existingAsset.blobURL) {
        return Promise.resolve(existingAsset.blobURL);
      } else {
        return new Promise<string>((resolve, reject) => {
          this._apiComms!.getAssetFile(assetID)
            .then((file) => {
              existingAsset.setFile(file);

              if (existingAsset.blobURL) {
                resolve(existingAsset.blobURL);
              } else {
                reject(new Error('Blob URL is empty'));
              }
            })
            .catch((e) => {
              reject(e);
            });
        });
      }
    } else {
      return new Promise<string>((resolve, reject) => {
        this._apiComms!.getAssetMeta(assetID)
          .then((assetMeta) => {
            this._apiComms!.getAssetFile(assetID)
              .then((url) => {
                const asset = this.assetFromDTO(assetMeta);
                asset.setFile(url);
                this.assetLookup.set(assetID, asset);
                if (asset.blobURL) {
                  resolve(asset.blobURL);
                } else {
                  reject(new Error('Blob URL is empty'));
                }
              })
              .catch((e) => {
                reject(e);
              });
          })
          .catch((e) => {
            reject(e);
          });
      });
    }
  };

  addAsset = (asset: AssetEntity): void => {
    if (this.assetLookup.has(asset.id)) return;
    this.assetLookup.set(asset.id, asset);
  };

  getAsset = (assetID: string): Promise<AssetEntity> => {
    if (!this._apiComms) {
      return Promise.reject(NO_API_COMMS_ERROR);
    }

    const existingAsset = this.assetLookup.get(assetID);
    if (existingAsset) {
      return Promise.resolve(existingAsset);
    }

    return new Promise<AssetEntity>((resolve, reject) => {
      this._apiComms!.getAssetMeta(assetID)
        .then((assetMeta: AssetDTO) => {
          const asset = this.assetFromDTO(assetMeta);
          this.assetLookup.set(assetID, asset);
          resolve(asset);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  getAssetsForOwner = (ownerID: string): Promise<AssetEntity[]> => {
    if (!this._apiComms) {
      return Promise.reject(NO_API_COMMS_ERROR);
    }

    return new Promise<AssetEntity[]>((resolve, reject) => {
      this._apiComms
        ?.getAssetsForOwner(ownerID)
        .then((ownedAssetMetas) => {
          const ownedAssets: AssetEntity[] = [];
          ownedAssetMetas.forEach((assetMeta) => {
            const asset = this.assetFromDTO(assetMeta);
            ownedAssets.push(asset);

            if (!this.assetLookup.has(assetMeta.id)) {
              this.assetLookup.set(assetMeta.id, asset);
            }
          });
          resolve(ownedAssets);
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  private assetFromDTO = (meta: AssetDTO): AssetEntity => {
    const asset = this.assetFactory(meta.id);
    asset.description = meta.description;
    asset.name = meta.name;
    asset.archived = meta.archived;
    asset.filename = meta.filename;
    return asset;
  };

  setAssetArchived = (assetID: string, archive: boolean): Promise<void> => {
    if (!this._apiComms) {
      return Promise.reject(NO_API_COMMS_ERROR);
    }

    const asset = this.assetLookup.get(assetID);
    if (!asset) {
      return Promise.reject(NO_ASSET_ERROR);
    }

    if (asset.archived === archive) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      this._apiComms!.updateArchiveAsset(assetID, archive)
        .then(() => {
          asset.archived = archive;
          resolve();
        })
        .catch((e) => {
          reject(e);
        });
    });
  };

  newAsset = (data: NewAssetDTO): Promise<AssetEntity> => {
    if (!this._apiComms) {
      return Promise.reject(NO_API_COMMS_ERROR);
    }

    return new Promise((resolve, reject) => {
      this._apiComms!.createNewAsset(data)

        .then((assetId: string) => {
          const asset = this.assetFactory(assetId);
          asset.description = data.description;
          asset.name = data.name;
          asset.archived = false;
          asset.filename = data.file.name;
          this.assetLookup.set(asset.id, asset);
          resolve(asset);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  updateAssetFile = (assetID: string, file: File): Promise<void> => {
    if (!this._apiComms) {
      return Promise.reject(NO_API_COMMS_ERROR);
    }

    const asset = this.assetLookup.get(assetID);
    if (!asset) {
      return Promise.reject(NO_ASSET_ERROR);
    }

    return new Promise((resolve, reject) => {
      this._apiComms!.updateAssetFile(assetID, file)
        .then((_) => {
          return this._apiComms!.getAssetFile(assetID);
        })
        .then((blobURL) => {
          asset.setFile(blobURL);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  deleteAsset = (assetID: string): Promise<void> => {
    if (!this._apiComms) {
      return Promise.reject(NO_API_COMMS_ERROR);
    }

    const asset = this.assetLookup.get(assetID);
    if (!asset) {
      return Promise.reject(NO_ASSET_ERROR);
    }

    return new Promise((resolve, reject) => {
      this._apiComms!.deleteAsset(assetID)
        .then((_) => {
          this.assetLookup.delete(assetID);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  constructor(appObj: HostAppObject) {
    super(appObj, AssetRepo.type);

    this.appObjects.registerSingleton(this);
  }
}

export const NO_API_COMMS_ERROR = new Error('API Communications have not been injected');

export const NO_ASSET_ERROR = new Error('Unable to find asset by id');
