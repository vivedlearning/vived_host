import { ActionNotImplemented, HostHandler, RequestHandler, UnableToParsePayload, UnsupportedRequestVerion } from "../../Entities";

export type GetAssetBlobAction = (
  assetID: string,
  callback: (blobURL: string | undefined) => void
) => void;

export class GetAssetBlobBase extends RequestHandler {
  readonly requestType = "GET_ASSET_BLOB";

  action: GetAssetBlobAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { assetID, callback } = this.castPayloadV1(payload);
      this.action(assetID, callback);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
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

  constructor(hostHandler: HostHandler) {
    super();
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  assetID: string;
  callback: (blobURL: string | undefined) => void;
};
