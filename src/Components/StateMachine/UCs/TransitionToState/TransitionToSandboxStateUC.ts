import { HostAppObject } from "../../../../HostAppObject";
import { AppSandboxEntity } from "../../../AppSandbox";
import { DispatchSetStateUC } from "../../../Dispatcher";
import { HostStateMachine } from "../../Entities";
import { TransitionToStateUC } from "./TransitionToStateUC";


export function makeTransitionToSandboxStateUC(
  appObject: HostAppObject
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
    const stateStr = JSON.stringify(state.stateData);
    const duration = stateMachine.transitionDuration;
    dispatchSetState.doDispatch(stateStr, duration);
  }

  constructor(appObject: HostAppObject) {
    super(appObject, TransitionToStateUC.type);

    this.appObjects.registerSingleton(this);
  }
}
