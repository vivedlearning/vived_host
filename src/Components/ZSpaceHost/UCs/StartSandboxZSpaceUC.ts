import { HostAppObject } from "../../../HostAppObject";
import { AppSandboxEntity, SandboxState } from "../../AppSandbox";
import { DispatchStartZSpaceUC } from "../../Dispatcher";
import { ZSpaceHostEntity } from "../Entities";
import { StartZSpaceUC } from "./StartZSpaceUC";
import { StopZSpaceUC } from "./StopZSpaceUC";


export function makeStartSandboxZSpaceUC(
  appObject: HostAppObject
): StartZSpaceUC {
  return new StartSandboxZSpaceUCImp(appObject);
}

class StartSandboxZSpaceUCImp extends StartZSpaceUC {
  private get zSpace() {
    return this.getCachedSingleton<ZSpaceHostEntity>(ZSpaceHostEntity.type);
  }

  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  private get stopUC() {
    return this.getCachedSingleton<StopZSpaceUC>(StopZSpaceUC.type);
  }

  startZSpace = (): Promise<void> => {
    if (!this.zSpace || !this.sandbox || !this.stopUC) {
      return Promise.reject("Missing Components");
    }

    const dispatcher = DispatchStartZSpaceUC.getByID(
      this.sandbox.appID,
      this.appObjects
    );

    if (!dispatcher) {
      return Promise.reject("Missing Dispatcher");
    }

    if (this.zSpace.isActive) {
      return Promise.resolve();
    }

    if (this.zSpace.emulate) {
      if (this.sandbox.state === SandboxState.PLAYING) {
        dispatcher.doDispatch({}, true);
      }
      this.zSpace.isActive = true;
      return Promise.resolve();
    }

    if (!this.zSpace.isSupported) {
      return Promise.reject(new Error("ZSpace is not supported"));
    }

    const zSpace = this.zSpace;
    const sandbox = this.sandbox;
    const stopUC = this.stopUC;

    return new Promise<void>((resolve, reject) => {
      (navigator as any).xr
        .requestSession("immersive-vr")
        .then((xrSession: XRSession) => {
          xrSession.addEventListener("end", stopUC.stopZSpace, {
            once: true
          });
          zSpace.session = xrSession;

          if (sandbox.state === SandboxState.PLAYING) {
            dispatcher.doDispatch(xrSession, false);
          }
          zSpace.isActive = true;
          resolve();
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, StartZSpaceUC.type);
    this.appObjects.registerSingleton(this);
  }
}
