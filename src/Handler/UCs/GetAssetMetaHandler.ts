import { AppObject, AppObjectUC } from "@vived/core";
import { GetAssetUC } from "../../Assets";
import {
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";
import { CallbackAssetMeta } from "./CallbackAssetDTO";

export type GetAssetMetaAction = (
  assetID: string,
  callback: (assetMeta: CallbackAssetMeta | undefined) => void
) => void;

export abstract class GetAssetMetaHandler
  extends AppObjectUC
  implements RequestHandler
{
  static readonly type = "GetAssetMetaHandler";

  readonly requestType = "GET_ASSET_META";

  abstract action: GetAssetMetaAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeGetAssetMetaHandler(
  appObject: AppObject
): GetAssetMetaHandler {
  return new GetAssetMetaHandlerImp(appObject);
}

class GetAssetMetaHandlerImp extends GetAssetMetaHandler {
  private get getAssetUC() {
    return this.getCachedSingleton<GetAssetUC>(GetAssetUC.type);
  }

  action: GetAssetMetaAction = (
    assetID: string,
    callback: (meta: CallbackAssetMeta | undefined) => void
  ) => {
    if (!this.getAssetUC) {
      this.error("Unable to find GetAssetUC");
      callback(undefined);
      return;
    }

    this.getAssetUC
      .getAsset(assetID)
      .then((asset) => {
        const { id, name, description } = asset;
        const meta: CallbackAssetMeta = {
          id,
          name,
          description
        };
        callback(meta);
      })
      .catch((e: Error) => {
        this.error(e.message);
        callback(undefined);
      });
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { assetID, callback } = this.castPayloadV1(payload);
      this.action(assetID, callback);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.assetID || !castPayload.callback) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: AppObject) {
    super(appObject, GetAssetMetaHandler.type);

    const hostHander = HostHandlerEntity.get(appObject);
    if (!hostHander) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHander.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  assetID: string;
  callback: (assetMeta: CallbackAssetMeta | undefined) => void;
};
