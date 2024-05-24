import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion
} from "../../Components";
import { HostHandlerX } from "../../Entities";
import { CallbackAssetMeta } from './CallbackAssetDTO';


export type GetLinkedAssetsAction = (
  assetID: string,
  type: string,
  callback: (linkedAssets: CallbackAssetMeta[] | undefined) => void,
) => void;

export class GetLinkedAssetsBase implements RequestHandler {
  readonly requestType = 'GET_LINKED_ASSETS';

  action: GetLinkedAssetsAction = () => {
    throw new ActionNotImplemented(this.requestType);
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
      throw new UnableToParsePayload(this.requestType, 1, JSON.stringify(payload));
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandlerX) {
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  assetID: string;
  type: string;
  callback: (linkedAssets: CallbackAssetMeta[] | undefined) => void;
};
