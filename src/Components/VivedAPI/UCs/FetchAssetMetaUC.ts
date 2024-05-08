import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";

export interface AssetMetaDTO {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  archived: boolean;
  filename: string;
  fileURL: string;
  linkedAssets: { type: string; asset: AssetMetaDTO }[];
}

export abstract class FetchAssetMetaUC extends HostAppObjectUC {
  static type = "FetchAssetMetaUC";

  abstract doFetch(assetID: string): Promise<AssetMetaDTO>;

  static get(appObjects: HostAppObjectRepo): FetchAssetMetaUC | undefined {
    return getSingletonComponent(FetchAssetMetaUC.type, appObjects);
  }
}

export function makeFetchAssetMetaUC(
  appObject: HostAppObject
): FetchAssetMetaUC {
  return new FetchAssetMetaUCImp(appObject);
}

class FetchAssetMetaUCImp extends FetchAssetMetaUC {
  private get requestJSON() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)
      ?.doRequest;
  }

  private get vivedAPI(): VivedAPIEntity | undefined {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  doFetch(assetID: string): Promise<AssetMetaDTO> {
    const vivedAPI = this.vivedAPI;
    const requestJSON = this.requestJSON;

    if (!vivedAPI || !requestJSON) {
      return Promise.reject();
    }

    return new Promise<AssetMetaDTO>((resolve, reject) => {
      const endpointUrl = vivedAPI.getEndpointURL(`assets/${assetID}`);
      const options: RequestJSONOptions = {
        method: "GET"
      };

      requestJSON(endpointUrl, options)
        .then((resp: Resp) => {
          const assetDTO = responseToDTO(resp.asset);
          assetDTO.id = assetID;

          resolve(assetDTO);
        })
        .catch((e: Error) => {
          this.warn(e.message);
          reject(e);
        });
    });
  }

  constructor(appObject: HostAppObject) {
    super(appObject, FetchAssetMetaUC.type);
    this.appObjects.registerSingleton(this);
  }
}

interface Resp {
  asset: BaseAssetResp;
}

interface BaseAssetResp {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  archived: boolean;
  fileURL: string;
  filename: string;
  linkedAssets: { type: string; asset: BaseAssetResp }[];
}

function responseToDTO(resp: BaseAssetResp): AssetMetaDTO {
  const linkedAssets = resp.linkedAssets.map((linkedAssetResp) => {
    return {
      type: linkedAssetResp.type,
      asset: responseToDTO(linkedAssetResp.asset)
    };
  });

  const dto: AssetMetaDTO = {
    archived: resp.archived,
    description: resp.description,
    fileURL: resp.fileURL,
    filename: resp.filename,
    id: resp.id,
    name: resp.name,
    linkedAssets,
    ownerId: resp.ownerId
  };

  return dto;
}
