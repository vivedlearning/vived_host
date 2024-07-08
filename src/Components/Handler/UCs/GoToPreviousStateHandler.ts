import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";

export abstract class GoToPreviousStateHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "GoToPreviousStateHandler";

  readonly requestType = "GO_TO_PREVIOUS_STATE";

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeGoToPreviousStateHandler(
  appObject: HostAppObject
): GoToPreviousStateHandler {
  return new GoToPreviousStateHandlerImp(appObject);
}

class GoToPreviousStateHandlerImp extends GoToPreviousStateHandler {
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
    super(appObject, GoToPreviousStateHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
