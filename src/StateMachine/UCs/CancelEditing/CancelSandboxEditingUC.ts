import { AppObject } from "@vived/core";
import { AppSandboxEntity, SandboxState } from "../../../AppSandbox/Entities";
import {
  DispatchIsAuthoringUC,
  DispatchSetStateUC,
  DispatchStateDTO
} from "../../../Dispatcher";
import { HostEditingStateEntity, HostStateMachine } from "../../Entities";
import { CancelEditingUC } from "./CancelEditingUC";

export function makeCancelSandboxEditingUC(
  appObject: AppObject
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
        const hideNavigation = this.stateMachine.states.length <= 1;
        const hasNextSlide = this.stateMachine.nextState !== undefined;
        const hasPreviousSlide = this.stateMachine.previousState !== undefined;
        const dto: DispatchStateDTO = {
          finalState: state.stateData,
          hideNavigation,
          hasNextSlide,
          hasPreviousSlide
        };
        dispatchSetState.doDispatch(dto);
      }
    } else {
      this.sandbox.state = SandboxState.MOUNTED;
    }
  };

  constructor(appObject: AppObject) {
    super(appObject, CancelEditingUC.type);
    this.appObjects.registerSingleton(this);
  }
}
