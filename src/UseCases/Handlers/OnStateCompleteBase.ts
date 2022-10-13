import { ActionNotImplemented, HostHandler, RequestHandler, UnsupportedRequestVerion } from '../../Entities';

export class OnStateCompleteBase extends RequestHandler {
  readonly requestType = 'ON_STATE_COMPLETED';

  action: ()=>void = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number) => {
    if (version === 1) {
      this.action();
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  constructor(hostHandler: HostHandler) {
    super();
    hostHandler.registerRequestHandler(this);
  }
}
