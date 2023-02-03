import {
  ActionNotImplemented,
  HostHandler,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion,
} from '../../Entities';

export interface ShowConfirmActionDTO {
  title: string;
  message: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  confirmCallback: () => void;
  cancelCallback: () => void;
}

export type ShowConfirmAction = (confirmData: ShowConfirmActionDTO) => void;

export class ShowConfirmBase extends RequestHandler {
  readonly requestType = 'SHOW_CONFIRM';

  action: ShowConfirmAction = () => {
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

  private castPayloadV1(payload: unknown): ShowConfirmActionDTO {
    const castPayload = payload as Payload_V1;
    if (
      castPayload.title === undefined ||
      castPayload.message === undefined ||
      castPayload.confirmButtonLabel === undefined ||
      castPayload.cancelButtonLabel === undefined ||
      castPayload.confirmCallback === undefined ||
      castPayload.cancelCallback === undefined
    ) {
      throw new UnableToParsePayload(this.requestType, 1, JSON.stringify(payload));
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandler) {
    super();
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  title: string;
  message: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  confirmCallback: () => void;
  cancelCallback: () => void;
};
