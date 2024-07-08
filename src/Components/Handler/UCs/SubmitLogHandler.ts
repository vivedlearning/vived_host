import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type Severity = "LOG" | "WARNING" | "ERROR" | "FATAL";

export type SubmitLogAction = (
  sender: string,
  severity: Severity,
  message: string
) => void;

export abstract class SubmitLogHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "SubmitLogHandler";

  readonly requestType = "SUBMIT_LOG";

  abstract action: SubmitLogAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeSubmitLogHandler(
  appObject: HostAppObject
): SubmitLogHandler {
  return new SubmitLogHandlerImp(appObject);
}

class SubmitLogHandlerImp extends SubmitLogHandler {
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

  constructor(appObject: HostAppObject) {
    super(appObject, SubmitLogHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  sender: string;
  message: string;
  severity: Severity;
};
