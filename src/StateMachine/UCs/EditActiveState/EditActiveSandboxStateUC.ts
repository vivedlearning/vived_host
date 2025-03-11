import { AppObject } from "@vived/core";
import { AppSandboxEntity } from "../../../AppSandbox/Entities/AppSandboxEntity";
import {
  DispatchIsAuthoringUC,
  DispatchSetStateUC,
  DispatchStateDTO
} from "../../../Dispatcher/UCs";
import { HostEditingStateEntity, HostStateMachine } from "../../Entities";
import { EditActiveStateUC } from "./EditActiveStateUC";

export function makeEditActiveSandboxStateUC(
  appObject: AppObject
): EditActiveStateUC {
  return new EditActiveSandboxStateUCImp(appObject);
}

class EditActiveSandboxStateUCImp extends EditActiveStateUC {
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

  editActiveState = (): void => {
    if (!this.sandbox || !this.stateMachine || !this.editStateEntity) return;

    const dispatchSetIsAuthoring = DispatchIsAuthoringUC.getByID(
      this.sandbox.appID,
      this.appObjects
    );

    if (!dispatchSetIsAuthoring) {
      this.error("Unable to find DispatchIsAuthoringUC");
      return;
    }

    const dispatchSetState = DispatchSetStateUC.getByID(
      this.sandbox.appID,
      this.appObjects
    );

    if (!dispatchSetState) {
      this.error("Unable to find DispatchIsAuthoringUC");
      return;
    }

    if (!this.stateMachine.activeState) {
      this.error("No active slide");
      return;
    }

    const state = this.stateMachine.getStateByID(this.stateMachine.activeState);
    if (!state) {
      this.warn("Unable to find state");
      return;
    }

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

    dispatchSetIsAuthoring.doDispatch(true);

    this.editStateEntity.startEditing(state);
  };

  constructor(appObject: AppObject) {
    super(appObject, EditActiveStateUC.type);
    this.appObjects.registerSingleton(this);
  }
}
