import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from '../../../HostAppObject';
import { AppAssetsEntity } from '../Entities/AppAssetsEntity';
import { AssetRepo } from '../Entities/AssetRepo';

export abstract class UpdateAssetIsArchivedUC extends HostAppObjectUC {
  static type = 'UpdateAssetIsArchivedUC';

  abstract setIsArchived(assetID: string, isArchived: boolean): Promise<void>;

  static get(hostAppObjects: HostAppObjectRepo): UpdateAssetIsArchivedUC | undefined {
    return getSingletonComponent(UpdateAssetIsArchivedUC.type, hostAppObjects);
  }
}

export function makeUpdateAssetIsArchivedUC(appObject: HostAppObject): UpdateAssetIsArchivedUC {
  return new UpdateAssetIsArchivedUCImp(appObject);
}

class UpdateAssetIsArchivedUCImp extends UpdateAssetIsArchivedUC {
  private get assetRepo(): AssetRepo | undefined {
    return this.getCachedSingleton(AssetRepo.type);
  }

  private get appAssets(): AppAssetsEntity | undefined {
    return this.getCachedSingleton(AppAssetsEntity.type);
  }

  setIsArchived = (assetID: string, isArchived: boolean): Promise<void> => {
    const assetRepo = this.assetRepo;
    if (!assetRepo) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      assetRepo
        .getAsset(assetID)
        .then((asset) => {
          if (asset.archived === isArchived) {
            resolve();
          } else {
            assetRepo
              .setAssetArchived(assetID, isArchived)
              .then(() => {
                asset.archived = isArchived;
                this.appAssets?.notifyOnChange();
                resolve();
              })
              .catch((e: Error) => {
                reject(e);
              });
          }
        })
        .catch((e) => {
          reject(new Error('Unable to find app asset by id ' + assetID));
        });
    });
  };
  constructor(appObject: HostAppObject) {
    super(appObject, UpdateAssetIsArchivedUC.type);
  }
}
