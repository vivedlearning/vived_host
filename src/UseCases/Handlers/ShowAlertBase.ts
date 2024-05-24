import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export interface ShowAlertActionDTO {
  title: string;
  message: string;
  closeButtonLabel: string;
  closeCallback: () => void;
}

export type ShowAlertAction = (confirmData: ShowAlertActionDTO) => void;

export class ShowAlertBase implements RequestHandler {
  readonly requestType = 'SHOW_ALERT';

  action: ShowAlertAction = () => {
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

  private castPayloadV1(payload: unknown): ShowAlertActionDTO {
    const castPayload = payload as Payload_V1;
    if (
      castPayload.title === undefined ||
      castPayload.message === undefined ||
      castPayload.closeButtonLabel === undefined ||
      castPayload.closeCallback === undefined
    ) {
      throw new UnableToParsePayload(this.requestType, 1, JSON.stringify(payload));
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandlerX) {
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  title: string;
  message: string;
  closeButtonLabel: string;
  closeCallback: () => void;
};
