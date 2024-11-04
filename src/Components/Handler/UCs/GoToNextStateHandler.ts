import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { HostStateMachine } from "../../StateMachine/Entities";
import {
  EndActivityUC,
  TransitionToStateUC
} from "../../StateMachine/UCs";
import {
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";

export abstract class GoToNextStateHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "GoToNextStateHandler";

  readonly requestType = "GO_TO_NEXT_STATE";

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeGoToNextStateHandler(
  appObject: HostAppObject
): GoToNextStateHandler {
  return new GoToNextStateHandlerImp(appObject);
}

class GoToNextStateHandlerImp extends GoToNextStateHandler {
  readonly payloadVersion = 1;

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
    if (version === this.payloadVersion) {
      this.action();
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  constructor(appObject: HostAppObject) {
    super(appObject, GoToNextStateHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
