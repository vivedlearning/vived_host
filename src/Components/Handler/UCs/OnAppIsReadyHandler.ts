import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";

export abstract class OnAppIsReadyHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "OnAppIsReadyHandler";

  readonly requestType = "APP_IS_READY";

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeOnAppIsReadyHandler(
  appObject: HostAppObject
): OnAppIsReadyHandler {
  return new OnAppIsReadyHandlerImp(appObject);
}

class OnAppIsReadyHandlerImp extends OnAppIsReadyHandler {
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
    super(appObject, OnAppIsReadyHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
