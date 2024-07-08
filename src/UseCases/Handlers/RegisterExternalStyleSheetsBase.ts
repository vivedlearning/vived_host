import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export type RegisterStylesheetsAction = (stylesheets: string[]) => void;

export class RegisterExternalStyleSheetsBase implements RequestHandler {
  readonly requestType = "REGISTER_EXTERNAL_STYLESHEETS";

  action: RegisterStylesheetsAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { stylesheets } = this.castPayloadV1(payload);
      this.action(stylesheets);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (castPayload.stylesheets === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandlerX) {
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  stylesheets: string[];
};
