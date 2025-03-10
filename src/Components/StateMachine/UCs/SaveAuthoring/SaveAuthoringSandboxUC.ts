import { AppObject } from "@vived/core";
import { AppSandboxEntity } from "../../../AppSandbox/Entities";
import { DispatchIsAuthoringUC } from "../../../Dispatcher";
import { HostEditingStateEntity, HostStateMachine } from "../../Entities";
import { SaveAuthoringUC } from "./SaveAuthoringUC";

export function makeSaveAuthoringSandboxUC(
  appObject: AppObject
): SaveAuthoringUC {
  return new SaveAuthoringSandboxUCImp(appObject);
}

class SaveAuthoringSandboxUCImp extends SaveAuthoringUC {
  private newStateDefaultName = "New State";

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

  saveAuthoring = (): void => {
    if (!this.sandbox || !this.stateMachine || !this.editStateEntity) return;

    if (this.editStateEntity.stateValidationMessage) {
      window.alert(this.editStateEntity.stateValidationMessage);
      return;
    }

    if (this.editStateEntity.isNewState && this.editStateEntity.editingState) {
      this.stateMachine.setActiveStateByID(
        this.editStateEntity.editingState.id
      );
      this.editStateEntity.editingState.name = "New State";
    }

    this.editStateEntity.finishEditing();

    const dispatchSetIsAuthoring = DispatchIsAuthoringUC.getByID(
      this.sandbox.appID,
      this.appObjects
    );

    if (!dispatchSetIsAuthoring) {
      this.error("Unable to find DispatchIsAuthoringUC");
      return;
    }

    dispatchSetIsAuthoring.doDispatch(false);
  };

  constructor(appObject: AppObject) {
    super(appObject, SaveAuthoringUC.type);

    this.appObjects.registerSingleton(this);
  }
}
