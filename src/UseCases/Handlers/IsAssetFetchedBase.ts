import {
  ActionNotImplemented,
  HostHandler,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion,
} from '../../Entities';

export interface IsAssetFetchedActionDTO {
  assetId: string;
  callback: (isFetched: boolean) => void;
}

export type IsAssetFetchedAction = (confirmData: IsAssetFetchedActionDTO) => void;

export class IsAssetFetchedBase extends RequestHandler {
  readonly requestType = 'IS_ASSET_FILE_FETCHED';

  action: IsAssetFetchedAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const castPayload = this.castPayloadV1(payload);
      this.action(castPayload);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): IsAssetFetchedActionDTO {
    const castPayload = payload as Payload_V1;
    if (castPayload.assetId === undefined || castPayload.callback === undefined) {
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
  assetId: string;
  callback: (isFetched: boolean) => void;
};
