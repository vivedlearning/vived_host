import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export interface ShowSpinnerActionDTO {
  message: string;
  title: string;
  closeCallback: (closeSpinner: () => void) => void;
}

export type ShowSpinnerAction = (confirmData: ShowSpinnerActionDTO) => void;

export abstract class ShowSpinnerHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "ShowSpinnerHandler";

  readonly requestType = "SHOW_SPINNER";

  abstract action: ShowSpinnerAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeShowSpinnerHandler(
  appObject: HostAppObject
): ShowSpinnerHandler {
  return new ShowSpinnerBase(appObject);
}

class ShowSpinnerBase extends ShowSpinnerHandler {
  action: ShowSpinnerAction = () => {
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

  private castPayloadV1(payload: unknown): ShowSpinnerActionDTO {
    const castPayload = payload as Payload_V1;
    if (
      castPayload.message === undefined ||
      castPayload.title === undefined ||
      castPayload.closeCallback === undefined
    ) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, ShowSpinnerHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  message: string;
  title: string;
  closeCallback: (closeSpinner: () => void) => void;
};
