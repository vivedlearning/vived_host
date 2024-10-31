import {
  HostAppObject,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";
import { DispatchStopAppUC } from "../../Dispatcher";

export abstract class StopAppUC extends HostAppObjectUC {
  static type = "StopAppUC";

  abstract stop(): void;

  static get(appObject: HostAppObject): StopAppUC | undefined {
    const asset = appObject.getComponent<StopAppUC>(StopAppUC.type);
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "StopAppUC.get",
        "Unable to find StartAppUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: HostAppObjectRepo
  ): StopAppUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "StopAppUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return StopAppUC.get(appObject);
  }

  static stopByID(id: string, appObjects: HostAppObjectRepo) {
    StopAppUC.getByID(id, appObjects)?.stop();
  }
}

export function makeStopAppUC(appObject: HostAppObject): StopAppUC {
  return new StartAppUCImp(appObject);
}

class StartAppUCImp extends StopAppUC {
  private get dispatchStop() {
    return this.getCachedLocalComponent<DispatchStopAppUC>(
      DispatchStopAppUC.type
    );
  }

  stop(): void {
    this.dispatchStop?.doDispatch();
  }

  constructor(appObject: HostAppObject) {
    super(appObject, StopAppUC.type);
  }
}
