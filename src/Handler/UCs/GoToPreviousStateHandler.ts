import { AppObject, AppObjectUC } from "@vived/core";
import { TransitionToStateUC } from "../../StateMachine/UCs";
import { HostStateMachine } from "../../StateMachine/Entities";
import {
  HostHandlerEntity,
  RequestHandler,
  UnsupportedRequestVersion
} from "../Entities";

export abstract class GoToPreviousStateHandler
  extends AppObjectUC
  implements RequestHandler
{
  static readonly type = "GoToPreviousStateHandler";

  readonly requestType = "GO_TO_PREVIOUS_STATE";

  abstract action: () => void;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeGoToPreviousStateHandler(
  appObject: AppObject
): GoToPreviousStateHandler {
  return new GoToPreviousStateHandlerImp(appObject);
}

class GoToPreviousStateHandlerImp extends GoToPreviousStateHandler {
  readonly payloadVersion = 1;

  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  private get transitionToStateUC() {
    return this.getCachedSingleton<TransitionToStateUC>(
      TransitionToStateUC.type
    );
  }

  action = () => {
    const prevState = this.stateMachine?.previousState;

    if (prevState) {
      this.transitionToStateUC?.transitionToState(prevState);
    }
  };

  handleRequest = (version: number) => {
    if (version === this.payloadVersion) {
      this.action();
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  constructor(appObject: AppObject) {
    super(appObject, GoToPreviousStateHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}
