import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchDisposeAppUC extends AppObjectUC {
  static readonly type = "DispatchDisposeAppUC";
  readonly requestType = "DISPOSE_APP";

  abstract doDispatch(): void;

  static get(appObject: AppObject): DispatchDisposeAppUC | undefined {
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

  static getByID(
    id: string,
    appObjects: AppObjectRepo
  ): DispatchDisposeAppUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "DispatchDisposeAppUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchDisposeAppUC.get(appObject);
  }
}

export function makeDispatchDisposeAppUC(
  appObject: AppObject
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

  constructor(appObject: AppObject) {
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
