import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";

export abstract class OnStateCompleteHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "OnStateCompleteHandler";

  readonly requestType = "ON_STATE_COMPLETED";

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeOnStateCompleteHandler(
  appObject: HostAppObject
): OnStateCompleteHandler {
  return new OnStateCompleteHandlerImp(appObject);
}

class OnStateCompleteHandlerImp extends OnStateCompleteHandler {
  action: () => void = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number) => {
    if (version === 1) {
      this.action();
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  constructor(appObject: HostAppObject) {
    super(appObject, OnStateCompleteHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
