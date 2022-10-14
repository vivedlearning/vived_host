import {
  ActionNotImplemented,
  HostHandler,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion,
} from '../../Entities';

export interface CallbackAssetsMeta {
  id: string;
  name: string;
  description: string;
}

export type GetOwnerAssetsMetaAction = (ownerID: string, callback: (assetMetas: CallbackAssetsMeta[]) => void) => void;

export class GetAssetsForOwnerBase extends RequestHandler {
  readonly requestType = 'GET_ASSET_FOR_OWNER';

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
      throw new UnableToParsePayload(this.requestType, 1, JSON.stringify(payload));
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandler) {
    super();
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  ownerID: string;
  callback: (assetMetas: CallbackAssetsMeta[]) => void;
};
