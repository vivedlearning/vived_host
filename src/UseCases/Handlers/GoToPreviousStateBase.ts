import { ActionNotImplemented, HostHandler, RequestHandler, UnsupportedRequestVerion } from '../../Entities';

export class GoToPreviousStateBase extends RequestHandler {
  readonly requestType = "GO_TO_PREVIOUS_STATE";
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

  constructor(handler: HostHandler) {
    super();
    handler.registerRequestHandler(this);
  }
}
