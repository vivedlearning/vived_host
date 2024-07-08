import {
  ActionNotImplemented,
  RequestHandler,
  UnsupportedRequestVersion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export class StartZSpaceBase implements RequestHandler {
  readonly requestType = "START_ZSPACE";
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

  constructor(handler: HostHandlerX) {
    handler.registerRequestHandler(this);
  }
}
