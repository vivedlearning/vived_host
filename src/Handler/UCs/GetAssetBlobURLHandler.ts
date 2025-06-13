import { AppObject, AppObjectUC } from "@vived/core";
import { GetAssetBlobURLUC } from "../../Assets";
import {
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type GetAssetBlobURLHandlerAction = (
  assetID: string,
  callback: (blobURL: string | undefined) => void
) => void;

export abstract class GetAssetBlobURLHandler
  extends AppObjectUC
  implements RequestHandler
{
  static readonly type = "GetAssetBlobURLHandler";

  readonly requestType = "GET_ASSET_BLOB";

  abstract action: GetAssetBlobURLHandlerAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeGetAssetBlobURLHandler(
  appObject: AppObject
): GetAssetBlobURLHandler {
  return new GetAssetBlobURLHandlerImp(appObject);
}

class GetAssetBlobURLHandlerImp extends GetAssetBlobURLHandler {
  private get getBlobUC() {
    return this.getCachedSingleton<GetAssetBlobURLUC>(GetAssetBlobURLUC.type);
  }

  action: GetAssetBlobURLHandlerAction = (
    assetID: string,
    callback: (blobURL: string | undefined) => void
  ) => {
    if (!this.getBlobUC) {
      this.error("Unable to find GetAssetBlobURLUC");
      callback(undefined);
      return;
    }

    this.getBlobUC
      .getAssetBlobURL(assetID)
      .then((url) => {
        callback(url);
      })
      .catch((e: Error) => {
        this.appObjects.submitError("GetAssetBlob", e.message);
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
    super(appObject, GetAssetBlobURLHandler.type);

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
  callback: (blobURL: string | undefined) => void;
};
