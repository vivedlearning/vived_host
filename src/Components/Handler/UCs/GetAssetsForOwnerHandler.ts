import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";
import { CallbackAssetMeta } from "./CallbackAssetDTO";

export type GetOwnerAssetsMetaAction = (
  ownerID: string,
  callback: (assetMetas: CallbackAssetMeta[]) => void
) => void;

export abstract class GetAssetsForOwnerHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "GetAssetsForOwnerHandler";

  readonly requestType = "GET_ASSET_FOR_OWNER";

  abstract action: GetOwnerAssetsMetaAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeGetAssetsForOwnerHandler(
  appObject: HostAppObject
): GetAssetsForOwnerHandler {
  return new GetAssetsForOwnerHandlerImp(appObject);
}

class GetAssetsForOwnerHandlerImp extends GetAssetsForOwnerHandler {
  action: GetOwnerAssetsMetaAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { ownerID, callback } = this.castPayloadV1(payload);
      this.action(ownerID, callback);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.ownerID || !castPayload.callback) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, GetAssetsForOwnerHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  ownerID: string;
  callback: (assetMetas: CallbackAssetMeta[]) => void;
};
