import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { HostStateMachine } from "../../StateMachine";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type OnStateChangeAction = (
  state: object,
  assets: string[],
  validationErrorMessage?: string
) => void;

export abstract class OnStateChangeHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "OnStateChangeHandler";

  readonly requestType = "ON_STATE_CHANGE";

  abstract action: OnStateChangeAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeOnStateChangeHandler(
  appObject: HostAppObject
): OnStateChangeHandler {
  return new OnStateChangeHandlerImp(appObject);
}

export class OnStateChangeHandlerImp extends OnStateChangeHandler {
  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  action: OnStateChangeAction = (
    state: object,
    assets: string[],
    validationErrorMessage?: string
  ) => {
    if (!this.stateMachine) return;

    this.stateMachine.lastEditingState = state;
    this.stateMachine.lastAssets = assets;
    this.stateMachine.validationErrorMessage = validationErrorMessage;
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { stateObject } = this.castPayloadV1(payload);
      this.action(stateObject, []);
    } else if (version === 2) {
      const { stateObject, validationErrorMessage } = this.castPayloadV2(
        payload
      );
      this.action(stateObject, [], validationErrorMessage);
    } else if (version === 3) {
      const {
        stateObject,
        assets,
        validationErrorMessage
      } = this.castPayloadV3(payload);
      this.action(stateObject, assets, validationErrorMessage);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  private castPayloadV2(payload: unknown): Payload_V2 {
    const castPayload = payload as Payload_V2;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        2,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  private castPayloadV3(payload: unknown): Payload_V3 {
    const castPayload = payload as Payload_V3;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        3,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, OnStateChangeHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  stateObject: object;
};

type Payload_V2 = {
  stateObject: object;
  validationErrorMessage?: string;
};

type Payload_V3 = {
  stateObject: object;
  assets: string[];
  validationErrorMessage?: string;
};
