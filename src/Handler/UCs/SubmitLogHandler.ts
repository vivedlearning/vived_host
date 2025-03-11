import { AppObject, AppObjectUC } from "@vived/core";
import { AppEntity } from "../../Apps";
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
  extends AppObjectUC
  implements RequestHandler {
  static readonly type = "SubmitLogHandler";

  readonly requestType = "SUBMIT_LOG";

  abstract action: SubmitLogAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeSubmitLogHandler(appObject: AppObject): SubmitLogHandler {
  return new SubmitLogHandlerImp(appObject);
}

class SubmitLogHandlerImp extends SubmitLogHandler {
  private get app() {
    return this.getCachedLocalComponent<AppEntity>(AppEntity.type);
  }

  action: SubmitLogAction = (
    sender: string,
    severity: Severity,
    message: string
  ) => {
    if (!this.app) {
      return;
    }

    const prependedSender = `[${this.app.name}] ${sender}`;

    if (severity === "LOG") {
      this.appObjects.submitLog(prependedSender, message);
    } else if (severity === "WARNING") {
      this.appObjects.submitWarning(prependedSender, message);
    } else if (severity === "ERROR") {
      this.appObjects.submitError(prependedSender, message);
    } else if (severity === "FATAL") {
      this.appObjects.submitFatal(prependedSender, message);
    } else {
      this.appObjects.submitLog(prependedSender, message);
      this.appObjects.submitWarning(
        "Host Handler - Submit Log",
        `Received an unsupported log severity type of ${severity}`
      );
    }
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

  constructor(appObject: AppObject) {
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
