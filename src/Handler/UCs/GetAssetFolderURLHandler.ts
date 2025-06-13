import { AppObject, AppObjectUC } from "@vived/core";
import { AppEntity } from "../../Apps";
import {
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type GetAssetFolderURLAction = (
  callback: (assetFolderURL: string) => void
) => void;

export abstract class GetAssetFolderURLHandler
  extends AppObjectUC
  implements RequestHandler
{
  static readonly type = "GetAssetFolderURLHandler";

  readonly requestType = "GET_APP_ASSET_URL";

  abstract action: GetAssetFolderURLAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeGetAssetFolderURLHandler(
  appObject: AppObject
): GetAssetFolderURLHandler {
  return new GetAssetFolderURLHandlerImp(appObject);
}

class GetAssetFolderURLHandlerImp extends GetAssetFolderURLHandler {
  private get app() {
    return this.getCachedLocalComponent<AppEntity>(AppEntity.type);
  }

  action: GetAssetFolderURLAction = (
    callback: (assetFolderURL: string) => void
  ) => {
    if (!this.app) {
      this.error("No AppEntity");
      callback("");
      return;
    }

    callback(this.app.appAssetFolderURL ?? "");
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { callback } = this.castPayloadV1(payload);
      this.action(callback);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.callback) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: AppObject) {
    super(appObject, GetAssetFolderURLHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  callback: (url: string) => void;
};
