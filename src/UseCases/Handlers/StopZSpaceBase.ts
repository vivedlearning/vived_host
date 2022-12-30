import { ActionNotImplemented, HostHandler, RequestHandler, UnsupportedRequestVerion } from '../../Entities';

export class StopZSpaceBase extends RequestHandler {
  readonly requestType = 'STOP_ZSPACE';
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
