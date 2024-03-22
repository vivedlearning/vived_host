import {
  ActionNotImplemented,
  HostHandler,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion,
} from '../../Entities';

export type SubmitActivityAssetAction = (assetFile: File, callback: (assetID: string | undefined) => void) => void;

export class SubmitActivityAssetBase extends RequestHandler {
  readonly requestType = 'SUBMIT_ACTIVITY_ASSET';

  action: SubmitActivityAssetAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { assetFile, callback } = this.castPayloadV1(payload);
      this.action(assetFile, callback);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.assetFile || !castPayload.callback) {
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
  assetFile: File;
  callback: (assetID: string | undefined) => void;
};
