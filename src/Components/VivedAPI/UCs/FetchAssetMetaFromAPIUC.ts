import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from '../../../HostAppObject';
import { AssetDTO } from '../../Assets';
import { VivedAPIEntity } from '../Entities/VivedAPIEntity';
import { JsonRequestUC, RequestJSONOptions } from './JsonRequestUC';

export abstract class FetchAssetMetaFromAPIUC extends HostAppObjectUC {
  static type = 'FetchAssetMetaFromAPIUC';

  abstract doFetch(assetID: string): Promise<AssetDTO>;

  static get(appObjects: HostAppObjectRepo): FetchAssetMetaFromAPIUC | undefined {
    return getSingletonComponent(FetchAssetMetaFromAPIUC.type, appObjects);
  }
}

export function makeFetchAssetMetaFromAPIUC(appObject: HostAppObject): FetchAssetMetaFromAPIUC {
  return new FetchAssetMetaUCImp(appObject);
}

class FetchAssetMetaUCImp extends FetchAssetMetaFromAPIUC {
  private get requestJSON() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)?.doRequest;
  }

  private get vivedAPI(): VivedAPIEntity | undefined {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  doFetch = (assetID: string): Promise<AssetDTO> => {
    const vivedAPI = this.vivedAPI;
    const requestJSON = this.requestJSON;

    if (!vivedAPI || !requestJSON) {
      return Promise.reject();
    }

    return new Promise<AssetDTO>((resolve, reject) => {
      const endpointUrl = vivedAPI.getEndpointURL(`assets/${assetID}`);
      const options: RequestJSONOptions = {
        method: 'GET',
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
    super(appObject, FetchAssetMetaFromAPIUC.type);
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

function responseToDTO(resp: BaseAssetResp): AssetDTO {
  const linkedAssets = resp.linkedAssets.map((linkedAssetResp) => {
    return {
      type: linkedAssetResp.type,
      asset: responseToDTO(linkedAssetResp.asset),
    };
  });

  const dto: AssetDTO = {
    archived: resp.archived,
    description: resp.description,
    fileURL: resp.fileURL,
    filename: resp.filename,
    id: resp.id,
    name: resp.name,
    linkedAssets,
    ownerId: resp.ownerId,
  };

  return dto;
}
