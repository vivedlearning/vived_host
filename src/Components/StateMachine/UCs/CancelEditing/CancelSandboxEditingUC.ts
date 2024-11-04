import { HostAppObject } from "../../../../HostAppObject";
import { AppSandboxEntity, SandboxState } from "../../../AppSandbox/Entities";
import { DispatchIsAuthoringUC, DispatchSetStateUC } from "../../../Dispatcher";
import { HostEditingStateEntity, HostStateMachine } from "../../Entities";
import { CancelEditingUC } from "./CancelEditingUC";

export function makeCancelSandboxEditingUC(
  appObject: HostAppObject
): CancelEditingUC {
  return new CancelSandboxEditingUC(appObject);
}

class CancelSandboxEditingUC extends CancelEditingUC {
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  private get editStateEntity() {
    return this.getCachedSingleton<HostEditingStateEntity>(
      HostEditingStateEntity.type
    );
  }

  cancel = (): void => {
    if (!this.sandbox || !this.stateMachine || !this.editStateEntity) return;

    const dispatchIsAuthoring = DispatchIsAuthoringUC.getByID(
      this.sandbox.appID,
      this.appObjects
    );
    if (!dispatchIsAuthoring) {
      this.error("App does not have DispatchIsAuthoringUC");
      return;
    }

    const dispatchSetState = DispatchSetStateUC.getByID(
      this.sandbox.appID,
      this.appObjects
    );
    if (!dispatchSetState) {
      this.error("App does not have DispatchSetStateUC");
      return;
    }

    this.editStateEntity.cancelEditState();
    dispatchIsAuthoring.doDispatch(false);

    if (this.stateMachine.activeState) {
      const state = this.stateMachine.getStateByID(
        this.stateMachine.activeState
      );
      if (state) {
        const stateData = JSON.stringify(state.stateData);
        dispatchSetState.doDispatch(stateData);
      }
    } else {
      this.sandbox.state = SandboxState.MOUNTED;
    }
  };

  constructor(appObject: HostAppObject) {
    super(appObject, CancelEditingUC.type);
    this.appObjects.registerSingleton(this);
  }
}
