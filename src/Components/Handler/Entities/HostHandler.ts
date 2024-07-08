import { HostAppObject, HostAppObjectEntity } from "../../../HostAppObject";
import { Handler, Request } from "../../../Types";

export interface RequestHandler {
  readonly requestType: string;
  handleRequest: (version: number, payload?: unknown) => void;
}

export abstract class HostHandlerEntity extends HostAppObjectEntity {
  static type = "HostHandlerEntity";

  static get(appObject: HostAppObject) {
    return appObject.getComponent<HostHandlerEntity>(HostHandlerEntity.type);
  }

  abstract handler: Handler;
  abstract registerRequestHandler: (requestHandler: RequestHandler) => void;
}

export function makeHostHandlerEntity(
  appObject: HostAppObject
): HostHandlerEntity {
  return new RequestHandlerImp(appObject);
}

class RequestHandlerImp extends HostHandlerEntity {
  private handlers = new Map<string, RequestHandler>();

  handler: Handler = (request: Request): void => {
    const handler = this.handlers.get(request.type);

    if (!handler) {
      this.warn(`Unsupported request type received: ${request.type}`);
      return;
    }

    try {
      handler.handleRequest(request.version, request.payload);
    } catch (e) {
      this.warn(`${e}`);
    }
  };

  registerRequestHandler = (handler: RequestHandler): void => {
    if (this.handlers.has(handler.requestType)) {
      this.warn(
        `More than one handler is being registered for ${handler.requestType}. Previous handler is being overwritten`
      );
    }

    this.handlers.set(handler.requestType, handler);
  };

  constructor(appObj: HostAppObject) {
    super(appObj, HostHandlerEntity.type);
  }
}

export class UnsupportedRequestVersion extends Error {
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
