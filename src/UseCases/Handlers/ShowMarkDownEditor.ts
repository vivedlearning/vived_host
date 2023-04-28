import {
  ActionNotImplemented,
  HostHandler,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion,
} from '../../Entities';

export interface ShowMarkDownEditorActionDTO {
  initialText: string;
  confirmCallback: () => void;
}

export type ShowMarkDownEditorAction = (confirmData: ShowMarkDownEditorActionDTO) => void;

export class ShowMarkDownEditor extends RequestHandler {
  readonly requestType = 'SHOW_MARKDOWN_EDITOR';

  action: ShowMarkDownEditorAction = () => {
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

  private castPayloadV1(payload: unknown): ShowMarkDownEditorActionDTO {
    const castPayload = payload as Payload_V1;
    if (castPayload.initialText === undefined || castPayload.confirmCallback === undefined) {
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
  initialText: string;
  confirmCallback: () => void;
};
