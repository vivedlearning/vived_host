import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { FetchAssetMetaFromAPIUC } from "../../VivedAPI";
import { AssetEntity } from "../Entities/AssetEntity";
import { AssetRepo } from "../Entities/AssetRepo";

export abstract class GetAssetUC extends HostAppObjectUC {
  static type = "GetAssetUC";

  abstract getAsset(assetID: string): Promise<AssetEntity>;

  static get(appObjects: HostAppObjectRepo): GetAssetUC | undefined {
    return getSingletonComponent<GetAssetUC>(GetAssetUC.type, appObjects);
  }
}

export function makeGetAssetUC(appObject: HostAppObject): GetAssetUC {
  return new GetAssetUCImp(appObject);
}

class GetAssetUCImp extends GetAssetUC {
  private assetRepo?: AssetRepo;

  private get fetchAssetMeta() {
    return this.getCachedSingleton<FetchAssetMetaFromAPIUC>(
      FetchAssetMetaFromAPIUC.type
    )?.doFetch;
  }

  getAsset = (assetID: string): Promise<AssetEntity> => {
    const assetRepo = this.assetRepo;
    const fetchAssetMeta = this.fetchAssetMeta;

    if (!assetRepo || !fetchAssetMeta) {
      return Promise.reject();
    }

    if (assetRepo.has(assetID)) {
      return Promise.resolve(assetRepo.get(assetID)!);
    }

    return new Promise((resolve, reject) => {
      fetchAssetMeta(assetID)
        .then((baseDTO) => {
          const baseAsset = assetRepo.addFromDTO(baseDTO);
          resolve(baseAsset);
        })
        .catch((e: Error) => {
          this.warn(e.message);
          reject(e);
        });
    });
  };
  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetUC.type);

    this.appObjects.registerSingleton(this);

    this.assetRepo = appObject.getComponent<AssetRepo>(AssetRepo.type);
    if (!this.assetRepo) {
      this.error("UC added to an App Object that does not have AssetRepo");
      return;
    }
  }
}
