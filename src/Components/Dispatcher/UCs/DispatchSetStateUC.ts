import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchSetStateUC extends HostAppObjectUC {
  static readonly type = "DispatchSetStateUC";
  readonly requestType = "SET_APP_STATE";

  abstract doDispatch(finalState: string, duration?: number | undefined): void;

  static get(appObject: HostAppObject): DispatchSetStateUC | undefined {
    const asset = appObject.getComponent<DispatchSetStateUC>(
      DispatchSetStateUC.type
    );
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "DispatchSetStateUC.get",
        "Unable to find DispatchSetStateUC on app object " + appObject.id
      );
    }
    return asset;
  }

  static getByID(id: string, appObjects: HostAppObjectRepo): DispatchSetStateUC | undefined {
    const appObject =  appObjects.get(id);
    
    if(!appObject) {
      appObjects.submitWarning(
        "DispatchSetStateUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchSetStateUC.get(appObject);
  }
}

export function makeDispatchSetStateUC(
  appObject: HostAppObject
): DispatchSetStateUC {
  return new DispatchSetStateUCImp(appObject);
}

class DispatchSetStateUCImp extends DispatchSetStateUC {
  readonly requestVersion = 2;
  private dispatcher?: HostDispatchEntity;

  doDispatch(finalState: string, duration?: number | undefined): void {
    if (!this.dispatcher) return;

    const payload = {
      finalState,
      duration
    };

    this.dispatcher.formRequestAndDispatch(
      this.requestType,
      this.requestVersion,
      payload
    );
  }

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchSetStateUC.type);

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
