import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export interface ShowSpinnerActionDTO {
  message: string;
  title: string;
  closeCallback: (closeSpinner: () => void) => void;
}

export type ShowSpinnerAction = (confirmData: ShowSpinnerActionDTO) => void;

export class ShowSpinnerBase implements RequestHandler {
  readonly requestType = 'SHOW_SPINNER';

  action: ShowSpinnerAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const castPayload = this.castPayloadV1(payload);
      this.action(castPayload);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): ShowSpinnerActionDTO {
    const castPayload = payload as Payload_V1;
    if (castPayload.message === undefined || castPayload.title === undefined || castPayload.closeCallback === undefined) {
      throw new UnableToParsePayload(this.requestType, 1, JSON.stringify(payload));
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandlerX) {
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  message: string;
  title: string;
  closeCallback: (closeSpinner: () => void) => void;
};
