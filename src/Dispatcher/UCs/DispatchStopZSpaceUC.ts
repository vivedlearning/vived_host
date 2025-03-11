import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchStopZSpaceUC extends AppObjectUC {
  static readonly type = "DispatchStopZSpaceUC";
  readonly requestType = "STOP_ZSPACE";

  abstract doDispatch(): void;

  static get(appObject: AppObject): DispatchStopZSpaceUC | undefined {
    const asset = appObject.getComponent<DispatchStopZSpaceUC>(
      DispatchStopZSpaceUC.type
    );
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "DispatchStopZSpaceUC.get",
        "Unable to find DispatchStopZSpaceUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(
    id: string,
    appObjects: AppObjectRepo
  ): DispatchStopZSpaceUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "DispatchStopZSpaceUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchStopZSpaceUC.get(appObject);
  }
}

export function makeDispatchStopZSpaceUC(
  appObject: AppObject
): DispatchStopZSpaceUC {
  return new DispatchStopZSpaceUCImp(appObject);
}

class DispatchStopZSpaceUCImp extends DispatchStopZSpaceUC {
  readonly requestVersion = 1;
  private dispatcher?: HostDispatchEntity;

  doDispatch(): void {
    if (!this.dispatcher) return;
    this.dispatcher.formRequestAndDispatch(
      this.requestType,
      this.requestVersion
    );
  }

  constructor(appObject: AppObject) {
    super(appObject, DispatchStopZSpaceUC.type);

    this.dispatcher = appObject.getComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
    if (!this.dispatcher) {
      this.error(
        "UC has been added to an App Object that does not have a HostDispatchEntity. Add a dispatcher first"
      );
      this.dispose();
    }
  }
}
