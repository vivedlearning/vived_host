import { RequestHandler } from "../Components";
import { Handler, Request } from "../Types";

export abstract class HostHandlerX {
  abstract handler: Handler;
  abstract registerRequestHandler: (requestHandler: RequestHandler) => void;
}

export function makeHostHandler(): HostHandlerX {
  return new RequestHandlerImp();
}

class RequestHandlerImp extends HostHandlerX {
  private handlers = new Map<string, RequestHandler>();

  handler: Handler = (request: Request): void => {
    const handler = this.handlers.get(request.type);

    if (!handler) {
      console.warn(
        `[HostHandler] Unsupported request type recieved: ${request.type}`
      );
      return;
    }

    try {
      handler.handleRequest(request.version, request.payload);
    } catch (e) {
      console.warn(`[HostHandler] ${e}`);
    }
  };

  registerRequestHandler = (handler: RequestHandler): void => {
    if (this.handlers.has(handler.requestType)) {
      console.warn(
        `[HostHandler] More than one handler is being registered for ${handler.requestType}. Previous handler is being overwritten`
      );
    }

    this.handlers.set(handler.requestType, handler);
  };
}
