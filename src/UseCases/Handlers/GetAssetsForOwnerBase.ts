import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion
} from "../../Components";
import { HostHandlerX } from "../../Entities";
import { CallbackAssetMeta } from "../../Components/Handler/UCs/CallbackAssetDTO";

export type GetOwnerAssetsMetaAction = (
  ownerID: string,
  callback: (assetMetas: CallbackAssetMeta[]) => void
) => void;

export class GetAssetsForOwnerBase implements RequestHandler {
  readonly requestType = "GET_ASSET_FOR_OWNER";

  action: GetOwnerAssetsMetaAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { ownerID, callback } = this.castPayloadV1(payload);
      this.action(ownerID, callback);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
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

  constructor(hostHandler: HostHandlerX) {
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  ownerID: string;
  callback: (assetMetas: CallbackAssetMeta[]) => void;
};
