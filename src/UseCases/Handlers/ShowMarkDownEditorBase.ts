import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export interface ShowMarkDownEditorActionDTO {
  initialText: string;
  submitCallback: (text: string) => void;
  validateString?: (text: string) => string | null;
}

export type ShowMarkDownEditorAction = (confirmData: ShowMarkDownEditorActionDTO) => void;

export class ShowMarkDownEditorBase implements RequestHandler {
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
    if (castPayload.initialText === undefined || castPayload.submitCallback === undefined) {
      throw new UnableToParsePayload(this.requestType, 1, JSON.stringify(payload));
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandlerX) {
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  initialText: string;
  submitCallback: (text: string) => void;
  validateString?: (text: string) => string | null;
};
