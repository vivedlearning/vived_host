import { ActionNotImplemented, HostHandler, RequestHandler, UnableToParsePayload, UnsupportedRequestVerion } from "../../Entities";


export type NewActivityAssetAction = (
  file: File,
  callback: (blobURL: string | undefined) => void
) => void;

export class NewActivityAssetBase extends RequestHandler {
  readonly requestType = "NEW_ACTIVITY_ASSET";

  action: NewActivityAssetAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { file, callback } = this.castPayloadV1(payload);
      this.action(file, callback);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.file || !castPayload.callback) {
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
  file: File;
  callback: (assetID: string | undefined) => void;
};
