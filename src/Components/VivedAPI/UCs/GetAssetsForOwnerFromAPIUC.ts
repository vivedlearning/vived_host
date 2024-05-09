import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from '../../../HostAppObject';
import { VivedAPIEntity } from '../Entities/VivedAPIEntity';
import { JsonRequestUC, RequestJSONOptions } from './JsonRequestUC';
import { SignedAuthTokenUC } from './SignedAuthTokenUC';

export interface OwnerAssetDTO {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  archived: boolean;
  filename: string;
  fileURL: string;
  linkedAssets: {
    type: string;
    asset: OwnerAssetDTO;
  }[];
}

export abstract class GetAssetsForOwnerFromAPIUC extends HostAppObjectUC {
  static type = 'GetAssetsForOwnerFromAPIUC';

  abstract getAssets(ownerID: string): Promise<OwnerAssetDTO[]>;

  static get(appObjects: HostAppObjectRepo): GetAssetsForOwnerFromAPIUC | undefined {
    return getSingletonComponent(GetAssetsForOwnerFromAPIUC.type, appObjects);
  }
}

export function makeGetAssetsForOwnerFromAPIUC(appObject: HostAppObject): GetAssetsForOwnerFromAPIUC {
  return new GetAssetsForOwnerUCImp(appObject);
}

class GetAssetsForOwnerUCImp extends GetAssetsForOwnerFromAPIUC {
  private get jsonRequester() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)?.doRequest;
  }

  private get getAuthToken() {
    return this.getCachedSingleton<SignedAuthTokenUC>(SignedAuthTokenUC.type)?.getUserAuthToken;
  }

  private get vivedAPI() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  getAssets = (ownerID: string): Promise<OwnerAssetDTO[]> => {
    const getAuthToken = this.getAuthToken;
    const vivedAPI = this.vivedAPI;
    const jsonRequester = this.jsonRequester;

    if (!getAuthToken || !vivedAPI || !jsonRequester) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      getAuthToken()
        .then((token) => {
          const url = vivedAPI.getEndpointURL(`assets/group/${ownerID}`);
          const page = 1;
          const itemsPerPage = 100;
          url.searchParams.append('page', page.toString());
          url.searchParams.append('itemsPerPage', itemsPerPage.toString());

          const options: RequestJSONOptions = {
            method: 'GET',
          };

          return jsonRequester(url, options);
        })
        .then((resp: APIResp) => {
          const ownerAssets: OwnerAssetDTO[] = resp.assets.map((asset) => {
            return this.responseToDTO(asset);
          });

          resolve(ownerAssets);
        })
        .catch((e) => {
          reject(e);
          return;
        });
    });
  };

  private responseToDTO(resp: BaseAssetResp): OwnerAssetDTO {
    const linkedAssets = resp.linkedAssets.map((linkedAssetResp) => {
      return {
        type: linkedAssetResp.type,
        asset: this.responseToDTO(linkedAssetResp.asset),
      };
    });

    const dto: OwnerAssetDTO = {
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

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetsForOwnerFromAPIUC.type);
    this.appObjects.registerSingleton(this);
  }
}

interface APIResp {
  assets: BaseAssetResp[];
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
