import { HostAppObject } from "../../../../HostAppObject";
import { AppSandboxEntity, SandboxState } from "../../../AppSandbox";
import { HostEditingStateEntity, HostStateMachine } from "../../Entities";
import { NewStateUC } from "./NewStateUC";


export function makeNewSandboxStateUC(appObject: HostAppObject): NewStateUC {
  return new NewSandboxStateUC(appObject);
}

class NewSandboxStateUC extends NewStateUC {
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

  createState = (): void => {
    if (!this.sandbox || !this.stateMachine || !this.editStateEntity) return;

    this.stateMachine.clearActiveState();

    const newState = this.editStateEntity.startNewState();
    if (!newState) return;

    this.sandbox.state = SandboxState.PLAYING;
  };

  constructor(appObject: HostAppObject) {
    super(appObject, NewStateUC.type);
    this.appObjects.registerSingleton(this);
  }
}
