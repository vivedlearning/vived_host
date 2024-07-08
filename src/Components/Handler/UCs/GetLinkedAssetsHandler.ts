import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { AssetEntity, GetAssetUC } from "../../Assets";
import {
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion
} from "../Entities";
import { CallbackAssetMeta } from "./CallbackAssetDTO";

export type GetLinkedAssetsAction = (
  assetID: string,
  type: string,
  callback: (linkedAssets: CallbackAssetMeta[] | undefined) => void
) => void;

export abstract class GetLinkedAssetsHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "GetLinkedAssetsHandler";

  readonly requestType = "GET_LINKED_ASSETS";

  abstract action: GetLinkedAssetsAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeGetLinkedAssetsHandler(
  appObject: HostAppObject
): GetLinkedAssetsHandler {
  return new GetLinkedAssetsHandlerImp(appObject);
}

class GetLinkedAssetsHandlerImp extends GetLinkedAssetsHandler {
  private get getAssetUC() {
    return this.getCachedSingleton<GetAssetUC>(GetAssetUC.type);
  }

  action: GetLinkedAssetsAction = (
    assetID: string,
    type: string,
    callback: (linkedAssets: CallbackAssetMeta[] | undefined) => void
  ) => {
    const getAssetUC = this.getAssetUC;
    if (!getAssetUC) {
      this.error("Unable to find GetAssetUC");
      callback(undefined);
      return;
    }

    getAssetUC
      .getAsset(assetID)
      .then((baseAsset) => {
        const { linkedAssets } = baseAsset;
        const getLinkedAssetPromises: Promise<AssetEntity>[] = [];

        linkedAssets.forEach((linkedAsset) => {
          if (linkedAsset.type === type) {
            getLinkedAssetPromises.push(getAssetUC.getAsset(linkedAsset.id));
          }
        });

        return Promise.all(getLinkedAssetPromises);
      })
      .then((linkedAssets) => {
        const linkedAssetMetas: CallbackAssetMeta[] = linkedAssets.map(
          (asset) => {
            return {
              description: asset.description,
              id: asset.id,
              name: asset.name
            };
          }
        );

        callback(linkedAssetMetas);
      })
      .catch((e: Error) => {
        this.appObjects.submitError("GetLinkedAssets", e.message);
        callback(undefined);
      });
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { assetID, callback, type } = this.castPayloadV1(payload);
      this.action(assetID, type, callback);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.assetID || !castPayload.callback || !castPayload.type) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, GetLinkedAssetsHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  assetID: string;
  type: string;
  callback: (linkedAssets: CallbackAssetMeta[] | undefined) => void;
};
