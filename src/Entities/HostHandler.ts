import { Handler, Request } from "./HostBoundary";

export abstract class RequestHandler {
  abstract readonly requestType: string;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export abstract class HostHandler {
  abstract handler: Handler;
  abstract registerRequestHandler: (requestHandler: RequestHandler) => void;
}

export function makeHostHandler(): HostHandler {
  return new RequestHandlerImp();
}

class RequestHandlerImp extends HostHandler {
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

export class UnsupportedRequestVerion extends Error {
  constructor(requestType: string, version: number) {
    const msg = `Version ${version} of request type ${requestType} is not supported`;
    super(msg);
  }
}

export class ActionNotImplemented extends Error {
  constructor(requestType: string) {
    const msg = `Action for request type ${requestType} is not implemented`;
    super(msg);
  }
}

export class UnableToParsePayload extends Error {
  constructor(requestType: string, version: number, payload: string) {
    const msg = `Unable to parse paylod for version ${version} of request type ${requestType}: ${payload}`;
    super(msg);
  }
}
