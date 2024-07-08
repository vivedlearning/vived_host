import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export type Severity = "LOG" | "WARNING" | "ERROR" | "FATAL";

export type SubmitLogAction = (
  sender: string,
  severity: Severity,
  message: string
) => void;

export class SubmitLogBase implements RequestHandler {
  readonly requestType = "SUBMIT_LOG";

  action: SubmitLogAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { sender, message, severity } = this.castPayloadV1(payload);
      this.action(sender, severity, message);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (
      castPayload.sender === undefined ||
      castPayload.severity === undefined ||
      castPayload.message === undefined
    ) {
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
  sender: string;
  message: string;
  severity: Severity;
};
