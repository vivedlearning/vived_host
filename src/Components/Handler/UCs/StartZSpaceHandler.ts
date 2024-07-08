import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";

export abstract class StartZSpaceHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "StartZSpaceHandler";

  readonly requestType = "START_ZSPACE";

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeStartZSpaceHandler(
  appObject: HostAppObject
): StartZSpaceHandler {
  return new StartZSpaceHandlerImp(appObject);
}

class StartZSpaceHandlerImp extends StartZSpaceHandler {
  readonly payloadVersion = 1;

  action: () => void = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number) => {
    if (version === this.payloadVersion) {
      this.action();
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  constructor(appObject: HostAppObject) {
    super(appObject, StartZSpaceHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
