import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { StopZSpaceUC } from "../../ZSpaceHost/UCs";
import {
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";

export abstract class StopZSpaceHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "StopZSpaceHandler";

  readonly requestType = "STOP_ZSPACE";

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeStopZSpaceHandler(
  appObject: HostAppObject
): StopZSpaceHandler {
  return new StopZSpaceHandlerImp(appObject);
}

class StopZSpaceHandlerImp extends StopZSpaceHandler {
  readonly payloadVersion = 1;

  private get stopUC() {
    return this.getCachedSingleton<StopZSpaceUC>(StopZSpaceUC.type);
  }

  action: () => void = () => {
    this.stopUC?.stopZSpace()
  };

  handleRequest = (version: number) => {
    if (version === this.payloadVersion) {
      this.action();
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  constructor(appObject: HostAppObject) {
    super(appObject, StopZSpaceHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
