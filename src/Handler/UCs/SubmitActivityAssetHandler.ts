import { AppObject, AppObjectUC } from "@vived/core";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type SubmitActivityAssetAction = (
  assetFile: File,
  callback: (assetID: string | undefined) => void
) => void;

export abstract class SubmitActivityAssetHandler
  extends AppObjectUC
  implements RequestHandler
{
  static readonly type = "SubmitActivityAssetHandler";

  readonly requestType = "SUBMIT_ACTIVITY_ASSET";

  abstract action: SubmitActivityAssetAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeSubmitActivityAssetHandler(
  appObject: AppObject
): SubmitActivityAssetHandler {
  return new SubmitActivityAssetHandlerImp(appObject);
}

class SubmitActivityAssetHandlerImp extends SubmitActivityAssetHandler {
  action: SubmitActivityAssetAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { assetFile, callback } = this.castPayloadV1(payload);
      this.action(assetFile, callback);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.assetFile || !castPayload.callback) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: AppObject) {
    super(appObject, SubmitActivityAssetHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  assetFile: File;
  callback: (assetID: string | undefined) => void;
};
