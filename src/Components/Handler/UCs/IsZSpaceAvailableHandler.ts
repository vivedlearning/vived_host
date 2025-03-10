import { AppObject, AppObjectUC } from "@vived/core";
import { ZSpaceHostEntity } from "../../ZSpaceHost";
import {
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type IsZSpaceAvailableAction = (
  callback: (isZSpaceAvailable: boolean) => void
) => void;

export abstract class IsZSpaceAvailableHandler
  extends AppObjectUC
  implements RequestHandler {
  static readonly type = "IsZSpaceAvailableHandler";

  readonly requestType = "IS_ZSPACE_AVAILABLE";

  abstract action: IsZSpaceAvailableAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeIsZSpaceAvailableHandler(
  appObject: AppObject
): IsZSpaceAvailableHandler {
  return new IsZSpaceAvailableHandlerImp(appObject);
}

class IsZSpaceAvailableHandlerImp extends IsZSpaceAvailableHandler {
  private get zSpace() {
    return this.getCachedSingleton<ZSpaceHostEntity>(ZSpaceHostEntity.type);
  }

  action: IsZSpaceAvailableAction = (
    callback: (isZSpaceAvailable: boolean) => void
  ) => {
    if (this.zSpace) {
      callback(this.zSpace.isSupported);
    } else {
      callback(false);
    }
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
    super(appObject, IsZSpaceAvailableHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  callback: (isZSpaceAvailable: boolean) => void;
};
