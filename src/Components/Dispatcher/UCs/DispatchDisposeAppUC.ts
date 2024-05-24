import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchDisposeAppUC extends HostAppObjectUC {
  static readonly type = "DispatchDisposeAppUC";
  readonly requestType = "DISPOSE_APP";

  abstract doDispatch(): void;

  static get(appObject: HostAppObject): DispatchDisposeAppUC | undefined {
    const asset = appObject.getComponent<DispatchDisposeAppUC>(
      DispatchDisposeAppUC.type
    );
    if (!asset) {
      appObject.appObjectRepo.submitWarning(
        "DispatchAppDispatcherUC.get",
        "Unable to find DispatchAppDispatcherUC on app object " + appObject.id
      );
    }
    return asset;
  }
}

export function makeDispatchDisposeAppUC(
  appObject: HostAppObject
): DispatchDisposeAppUC {
  return new DispatchDisposeAppUCImp(appObject);
}

class DispatchDisposeAppUCImp extends DispatchDisposeAppUC {
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
    super(appObject, DispatchDisposeAppUC.type);

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
