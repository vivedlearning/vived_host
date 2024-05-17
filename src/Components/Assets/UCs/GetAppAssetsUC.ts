import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { GetAssetsForOwnerFromAPIUC } from "../../VivedAPI";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";
import { AssetRepo } from "../Entities/AssetRepo";

export abstract class GetAppAssetsUC extends HostAppObjectUC {
  static type = "GetAppAssetsUC";

  abstract getAppAssets(appID: string): Promise<void>;

  static get(appObjects: HostAppObjectRepo): GetAppAssetsUC | undefined {
    return getSingletonComponent<GetAppAssetsUC>(
      GetAppAssetsUC.type,
      appObjects
    );
  }
}

export function makeGetAppAssetUC(appObject: HostAppObject): GetAppAssetsUC {
  return new GetAppAssetsUCImp(appObject);
}

class GetAppAssetsUCImp extends GetAppAssetsUC {
  private appAssets?: AppAssetsEntity;

  private get getAssetsUC() {
    return this.getCachedSingleton<GetAssetsForOwnerFromAPIUC>(
      GetAssetsForOwnerFromAPIUC.type
    )?.getAssets;
  }

  private get assetRepo() {
    return this.getCachedSingleton<AssetRepo>(AssetRepo.type);
  }

  getAppAssets = (appID: string): Promise<void> => {
    const appAssets = this.appAssets;
    const getAssetsUC = this.getAssetsUC;
    const assetRepo = this.assetRepo;

    if (!appAssets || !getAssetsUC || !assetRepo) {
      return Promise.reject();
    }

    return new Promise<void>((resolve, reject) => {
      getAssetsUC(appID)
        .then((dtos) => {
          dtos.forEach((dto) => {
            assetRepo.addFromDTO(dto);
            appAssets.add(dto.id);
          });
          resolve();
        })
        .catch((e: Error) => {
          reject(e);
        });
    });
  }

  constructor(appObject: HostAppObject) {
    super(appObject, GetAppAssetsUC.type);

    this.appObjects.registerSingleton(this);

    this.appAssets = appObject.getComponent<AppAssetsEntity>(
      AppAssetsEntity.type
    );
    if (!this.appAssets) {
      this.error(
        "UC added to an App Object that does not have AppAssetsEntity"
      );
      return;
    }
  }
}
