import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type NewActivityAssetAction = (
  file: File,
  callback: (blobURL: string | undefined) => void
) => void;

export abstract class NewActivityAssetHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "NewActivityAssetHandler";

  readonly requestType = "NEW_ACTIVITY_ASSET";

  abstract action: NewActivityAssetAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeNewActivityAssetAction(
  appObject: HostAppObject
): NewActivityAssetHandler {
  return new NewActivityAssetHandlerImp(appObject);
}

class NewActivityAssetHandlerImp extends NewActivityAssetHandler {
  action: NewActivityAssetAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { file, callback } = this.castPayloadV1(payload);
      this.action(file, callback);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
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

  constructor(appObject: HostAppObject) {
    super(appObject, NewActivityAssetHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  file: File;
  callback: (assetID: string | undefined) => void;
};
