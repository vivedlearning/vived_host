import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type ShowSelectModelAction = (
  callback: (modelId: string) => void
) => void;

export abstract class ShowSelectModelHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "ShowSelectModelHandler";

  readonly requestType = "SHOW_SELECT_MODEL";

  abstract action: ShowSelectModelAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeShowSelectModelHandler(
  appObject: HostAppObject
): ShowSelectModelHandler {
  return new ShowSelectModelHandlerImp(appObject);
}

class ShowSelectModelHandlerImp extends ShowSelectModelHandler {
  action: ShowSelectModelAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const castPayload = this.castPayloadV1(payload);
      this.action(castPayload);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): (modelId: string) => void {
    const castPayload = payload as Payload_V1;
    if (castPayload.callback === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload.callback;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, ShowSelectModelHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  callback: (modelId: string) => void;
};
