import {
  ActionNotImplemented,
  RequestHandler,
  UnsupportedRequestVerion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export class GoToNextStateBase implements RequestHandler {
  readonly requestType = "GO_TO_NEXT_STATE";
  readonly payloadVersion = 1;

  action: () => void = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number) => {
    if (version === this.payloadVersion) {
      this.action();
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  constructor(handler: HostHandlerX) {
    handler.registerRequestHandler(this);
  }
}
