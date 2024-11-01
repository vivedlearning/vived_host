import { HostAppObject } from "../../../../HostAppObject";
import { AppSandboxEntity } from "../../../AppSandbox";
import { DispatchIsAuthoringUC, DispatchSetStateUC } from "../../../Dispatcher";
import { HostEditingStateEntity, HostStateMachine } from "../../Entities";
import { EditActiveStateUC } from "./EditActiveStateUC";


export function makeEditActiveSandboxStateUC(
  appObject: HostAppObject
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

    const stateStr = JSON.stringify(state.stateData);
    dispatchSetState.doDispatch(stateStr);

    dispatchSetIsAuthoring.doDispatch(true);

    this.editStateEntity.startEditing(state);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, EditActiveStateUC.type);
    this.appObjects.registerSingleton(this);
  }
}
