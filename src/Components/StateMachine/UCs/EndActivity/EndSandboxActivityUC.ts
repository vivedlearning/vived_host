import { HostAppObject } from "../../../../HostAppObject";
import { AppSandboxEntity, SandboxState } from "../../../AppSandbox";
import { StopZSpaceUC, ZSpaceHostEntity } from "../../../ZSpaceHost";
import { HostStateMachine } from "../../Entities";
import { EndActivityUC } from "./EndActivityUC";

export function makeEndSandboxActivityUC(appObj: HostAppObject): EndActivityUC {
  return new EndSandboxActivityUC(appObj);
}

class EndSandboxActivityUC extends EndActivityUC {
  private get zSpace() {
    return this.getCachedSingleton<ZSpaceHostEntity>(ZSpaceHostEntity.type);
  }

  private get stopZSpaceUC() {
    return this.getCachedSingleton<StopZSpaceUC>(StopZSpaceUC.type);
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  end(): void {
    if (this.zSpace?.isActive) {
      this.stopZSpaceUC?.stopZSpace();
    }

    this.stateMachine?.clearActiveState();
    if (this.sandbox) {
      this.sandbox.state = SandboxState.MOUNTED;
    }
  }

  constructor(appObject: HostAppObject) {
    super(appObject, EndActivityUC.type);
  }
}
