import { HostAppObject } from "../../../../HostAppObject";
import { AppSandboxEntity, SandboxState } from "../../../AppSandbox";
import { StartZSpaceUC } from "../../../ZSpaceHost";
import { HostEditingStateEntity, HostStateMachine } from "../../Entities";
import { ConsumeStateUC } from "./ConsumeStateUC";

export function makeConsumeSandboxStateUC(
  appObj: HostAppObject
): ConsumeStateUC {
  return new ConsumeSandboxStateUC(appObj);
}

class ConsumeSandboxStateUC extends ConsumeStateUC {
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

  private get startZSpaceUC() {
    return this.getCachedSingleton<StartZSpaceUC>(StartZSpaceUC.type);
  }

  consume = (id: string) => {
    if (
      !this.sandbox ||
      !this.stateMachine ||
      !this.editStateEntity ||
      !this.startZSpaceUC
    ) {
      this.error("Missing component");
      return;
    }

    this.editStateEntity.cancelEditState();

    if (this.stateMachine.hasState(id)) {
      this.stateMachine?.setActiveStateByID(id);

      if (this.sandbox) this.sandbox.state = SandboxState.PLAYING;

      if (this.sandbox.startInZSpace) {
        this.startZSpaceUC.startZSpace();
      }
    } else {
      this.error("Unable to find state by id " + id);
    }
  };

  constructor(appObject: HostAppObject) {
    super(appObject, ConsumeStateUC.type);

    this.appObjects.registerSingleton(this);
  }
}
