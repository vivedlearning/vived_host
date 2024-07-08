import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export type ShowSelectModelAction = (
  callback: (modelId: string) => void
) => void;

export class ShowSelectModelBase implements RequestHandler {
  readonly requestType = "SHOW_SELECT_MODEL";

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

  constructor(hostHandler: HostHandlerX) {
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  callback: (modelId: string) => void;
};
