import { AppObject, AppObjectUC } from "@vived/core";
import {
  EndActivityUC,
  HostStateMachine,
  TransitionToStateUC
} from "../../StateMachine";
import {
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";

export abstract class OnStateCompleteHandler
  extends AppObjectUC
  implements RequestHandler {
  static readonly type = "OnStateCompleteHandler";

  readonly requestType = "ON_STATE_COMPLETED";

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeOnStateCompleteHandler(
  appObject: AppObject
): OnStateCompleteHandler {
  return new OnStateCompleteHandlerImp(appObject);
}

class OnStateCompleteHandlerImp extends OnStateCompleteHandler {
  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  private get transitionToStateUC() {
    return this.getCachedSingleton<TransitionToStateUC>(
      TransitionToStateUC.type
    );
  }

  private get endActivityUC() {
    return this.getCachedSingleton<EndActivityUC>(EndActivityUC.type);
  }

  action = () => {
    const nextState = this.stateMachine?.nextState;

    if (nextState) {
      this.transitionToStateUC?.transitionToState(nextState);
    } else {
      this.endActivityUC?.end();
    }
  };

  handleRequest = (version: number) => {
    if (version === 1) {
      this.action();
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  constructor(appObject: AppObject) {
    super(appObject, OnStateCompleteHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
