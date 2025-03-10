import { AppObject } from "@vived/core";
import { AppSandboxEntity } from "../../../AppSandbox/Entities";
import { DispatchSetStateUC, DispatchStateDTO } from "../../../Dispatcher";
import { HostStateMachine } from "../../Entities";
import { TransitionToStateUC } from "./TransitionToStateUC";

export function makeTransitionToSandboxStateUC(
  appObject: AppObject
): TransitionToStateUC {
  return new TransitionToSandboxStateUCImp(appObject);
}

class TransitionToSandboxStateUCImp extends TransitionToStateUC {
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  transitionToState(id: string): void {
    if (!this.sandbox || !this.stateMachine) return;

    const dispatchSetState = DispatchSetStateUC.getByID(
      this.sandbox.appID,
      this.appObjects
    );

    if (!dispatchSetState) {
      this.error("Unable to find DispatchSetStateUC");
      return;
    }

    const stateMachine = this.stateMachine;

    const state = this.stateMachine.getStateByID(id);
    if (!state) {
      this.warn(`Unable to find state ${id}`);
      return;
    }

    stateMachine.setActiveStateByID(id);
    const duration = stateMachine.transitionDuration;
    const hideNavigation = stateMachine.states.length <= 1;
    const hasNextSlide = stateMachine.nextState !== undefined;
    const hasPreviousSlide = stateMachine.previousState !== undefined;

    const dto: DispatchStateDTO = {
      finalState: state.stateData,
      duration,
      hideNavigation,
      hasNextSlide,
      hasPreviousSlide
    };
    dispatchSetState.doDispatch(dto);
  }

  constructor(appObject: AppObject) {
    super(appObject, TransitionToStateUC.type);

    this.appObjects.registerSingleton(this);
  }
}
