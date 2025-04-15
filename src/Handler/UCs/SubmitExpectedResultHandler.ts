import { AppObject, AppObjectUC } from "@vived/core";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";
import { HostStateMachine } from "../../StateMachine/Entities/HostStateMachine";
import { ChallengeResponse } from "../../StateMachine/Entities/HostStateEntity";

export type SubmitExpectedResultAction = (responseType: string) => void;

export abstract class SubmitExpectedResultHandler
  extends AppObjectUC
  implements RequestHandler
{
  static readonly type = "SubmitExpectedResultHandler";

  readonly requestType = "SUBMIT_EXPECTED_RESULT";

  abstract action: SubmitExpectedResultAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeSubmitExpectedResultHandler(
  appObject: AppObject
): SubmitExpectedResultHandler {
  return new SubmitExpectedResultHandlerImp(appObject);
}

class SubmitExpectedResultHandlerImp extends SubmitExpectedResultHandler {
  action: SubmitExpectedResultAction = (responseType: string) => {
    const stateMachine = HostStateMachine.get(this.appObjects);
    if (!stateMachine) {
      this.error("Unable to get HostStateMachine");
      return;
    }

    const activeStateId = stateMachine.activeState;
    if (!activeStateId) {
      this.warn("No active state to set expected response on");
      return;
    }

    const stateEntity = stateMachine.getStateByID(activeStateId);
    if (!stateEntity) {
      this.error(`Unable to get state entity for ID: ${activeStateId}`);
      return;
    }

    stateEntity.expectedResponse = responseType as ChallengeResponse;
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { responseType } = this.castPayloadV1(payload);
      this.action(responseType);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.responseType) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: AppObject) {
    super(appObject, SubmitExpectedResultHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  responseType: string;
};
