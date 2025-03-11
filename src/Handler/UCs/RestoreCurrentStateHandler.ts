import { AppObject, AppObjectUC } from "@vived/core";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";
import { HasPreviousStateHandler } from "./HasPreviousStateHandler";

export abstract class RestoreCurrentStateHandler
  extends AppObjectUC
  implements RequestHandler {
  static readonly type = "RestoreCurrentStateHandler";

  readonly requestType = "RESTORE_CURRENT_STATE";

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeRestoreCurrentStateHandler(
  appObject: AppObject
): RestoreCurrentStateHandler {
  return new RestoreCurrentStateHandlerImp(appObject);
}

class RestoreCurrentStateHandlerImp extends RestoreCurrentStateHandler {
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

  constructor(appObject: AppObject) {
    super(appObject, HasPreviousStateHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
