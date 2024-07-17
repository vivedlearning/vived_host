import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { HostStateMachine } from "../../StateMachine";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type HasPreviousStateAction = (
  callback: (hasNextState: boolean) => void
) => void;

export abstract class HasPreviousStateHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "HasPreviousStateHandler";

  readonly requestType = "HAS_PREVIOUS_STATE";

  abstract action: HasPreviousStateAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeHasPreviousStateHandler(
  appObject: HostAppObject
): HasPreviousStateHandler {
  return new HasPreviousStateHandlerImp(appObject);
}

class HasPreviousStateHandlerImp extends HasPreviousStateHandler {
  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  action: HasPreviousStateAction = (
    cb: (hasPreviousState: boolean) => void
  ) => {
    if (!this.stateMachine) {
      cb(false);
      return;
    }

    if (this.stateMachine.previousState) {
      cb(true);
    } else {
      cb(false);
    }
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { callback } = this.castPayloadV1(payload);
      this.action(callback);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.callback) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, HasPreviousStateHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  callback: (hasNextState: boolean) => void;
};
