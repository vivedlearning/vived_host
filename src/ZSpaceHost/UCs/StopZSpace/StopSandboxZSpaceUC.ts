import { AppObject } from "@vived/core";
import { AppSandboxEntity } from "../../../AppSandbox/Entities";
import { DispatchStopZSpaceUC } from "../../../Dispatcher/UCs";
import { ZSpaceHostEntity } from "../../Entities";
import { StopZSpaceUC } from "./StopZSpaceUC";

export function makeStopSandboxZSpaceUC(appObject: AppObject): StopZSpaceUC {
  return new StopSandboxZSpaceUCImp(appObject);
}

class StopSandboxZSpaceUCImp extends StopZSpaceUC {
  private get zSpace() {
    return this.getCachedSingleton<ZSpaceHostEntity>(ZSpaceHostEntity.type);
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  stopZSpace = (): void => {
    if (!this.sandbox || !this.zSpace) return;

    const dispatcher = DispatchStopZSpaceUC.getByID(
      this.sandbox.appID,
      this.appObjects
    );

    if (!dispatcher) {
      this.warn("Unable to find DispatchStopZSpaceUC");
      return;
    }

    if (!this.zSpace.isActive) return;

    dispatcher.doDispatch();
    this.zSpace.session?.removeEventListener("end", this.stopZSpace);
    this.zSpace.session?.end();
    this.zSpace.session = undefined;
    this.zSpace.isActive = false;
  };

  constructor(appObject: AppObject) {
    super(appObject, StopZSpaceUC.type);

    this.appObjects.registerSingleton(this);
  }
}
