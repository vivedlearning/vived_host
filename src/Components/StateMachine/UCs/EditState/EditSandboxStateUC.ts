import { AppObject } from "@vived/core";
import { AppSandboxEntity, SandboxState } from "../../../AppSandbox/Entities";
import { HostEditingStateEntity, HostStateMachine } from "../../Entities";
import { EditStateUC } from "./EditStateUC";

export function makeEditSandboxStateUC(appObject: AppObject): EditStateUC {
  return new EditSandboxStateUC(appObject);
}

class EditSandboxStateUC extends EditStateUC {
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

  edit(id: string): void {
    if (!this.sandbox || !this.stateMachine || !this.editStateEntity) return;

    const state = this.stateMachine.getStateByID(id);
    if (!state) {
      this.warn("Unable to find state");
      return;
    }

    this.stateMachine.setActiveStateByID(id);
    this.editStateEntity.startEditing(state);
    this.sandbox.state = SandboxState.PLAYING;
  }

  constructor(appObject: AppObject) {
    super(appObject, EditStateUC.type);

    this.appObjects.registerSingleton(this);
  }
}
