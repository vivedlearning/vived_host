import { HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchIsAuthoringUC extends HostAppObjectUC {
  static readonly type = "DispatchIsAuthoringUC";
  readonly requestType = "SET_IS_AUTHORING";

  abstract doDispatch(isAuthoring: boolean): void;

  static get(appObject: HostAppObject): DispatchIsAuthoringUC | undefined {
    const asset = appObject.getComponent<DispatchIsAuthoringUC>(
      DispatchIsAuthoringUC.type
    );
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "DispatchIsAuthoringUC.get",
        "Unable to find DispatchIsAuthoringUC on app object " +
          appObject.id
      );
    }
    return asset;
  }

  static getByID(id: string, appObjects: HostAppObjectRepo): DispatchIsAuthoringUC | undefined {
    const appObject =  appObjects.get(id);
    
    if(!appObject) {
      appObjects.submitWarning(
        "DispatchIsAuthoringUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchIsAuthoringUC.get(appObject);
  }
}

export function makeDispatchIsAuthoringUC(
  appObject: HostAppObject
): DispatchIsAuthoringUC {
  return new DispatchIsAuthoringUCImp(appObject);
}

class DispatchIsAuthoringUCImp extends DispatchIsAuthoringUC {
  readonly requestVersion = 1;
  private dispatcher?: HostDispatchEntity;

  doDispatch(isAuthoring: boolean): void {
    if (!this.dispatcher) return;

    const payload = {
      isAuthoring
    };
    this.dispatcher.formRequestAndDispatch(
      this.requestType,
      this.requestVersion,
      payload
    );
  }

  constructor(appObject: HostAppObject) {
    super(appObject, DispatchIsAuthoringUC.type);

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
