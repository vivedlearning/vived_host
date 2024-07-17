import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { HostStateMachine } from "../../StateMachine";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type HasNextStateAction = (
  callback: (hasNextState: boolean) => void
) => void;

export abstract class HasNextStateHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "HasNextStateHandler";

  readonly requestType = "HAS_NEXT_STATE";

  abstract action: HasNextStateAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeHasNextStateHandler(
  appObject: HostAppObject
): HasNextStateHandler {
  return new HasNextStateHandlerImp(appObject);
}

class HasNextStateHandlerImp extends HasNextStateHandler {
  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  action: HasNextStateAction = (cb: (hasNextState: boolean) => void) => {
    if (!this.stateMachine) {
      cb(false);
      return;
    }

    if (this.stateMachine.nextState) {
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
    super(appObject, HasNextStateHandler.type);

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
