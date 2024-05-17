import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchStopZSpaceUC extends HostAppObjectUC {
  static readonly type = "DispatchStopZSpaceUC";
  readonly requestType = "STOP_ZSPACE";

  abstract doDispatch(): void;

  static get(appObject: HostAppObject): DispatchStopZSpaceUC | undefined {
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
}

export function makeDispatchStopZSpaceUC(
  appObject: HostAppObject
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

  constructor(appObject: HostAppObject) {
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
