import { AppObject, AppObjectRepo, AppObjectUC } from "@vived/core";
import { HostDispatchEntity } from "../Entities";

export abstract class DispatchEnableFeatureUC extends AppObjectUC {
  static readonly type = "DispatchEnableFeatureUC";
  readonly requestType = "ENABLE_FEATURE";

  abstract doDispatch(featureFlag: string): void;

  static get(appObject: AppObject): DispatchEnableFeatureUC | undefined {
    const uc = appObject.getComponent<DispatchEnableFeatureUC>(
      DispatchEnableFeatureUC.type
    );
    if (!uc) {
      appObject.appObjectRepo.submitWarning(
        "DispatchEnableFeatureUC.get",
        "Unable to find DispatchEnableFeatureUC on app object " + appObject.id
      );
    }
    return uc;
  }

  static getByID(
    id: string,
    appObjects: AppObjectRepo
  ): DispatchEnableFeatureUC | undefined {
    const appObject = appObjects.get(id);

    if (!appObject) {
      appObjects.submitWarning(
        "DispatchEnableFeatureUC.getByID",
        "Unable to find App Object by id " + id
      );
      return undefined;
    }

    return DispatchEnableFeatureUC.get(appObject);
  }
}

export function makeDispatchEnableFeatureUC(
  appObject: AppObject
): DispatchEnableFeatureUC {
  return new DispatchAddChannelModelUCImp(appObject);
}

class DispatchAddChannelModelUCImp extends DispatchEnableFeatureUC {
  readonly requestVersion = 1;
  private get dispatcher() {
    return this.getCachedLocalComponent<HostDispatchEntity>(
      HostDispatchEntity.type
    );
  }

  doDispatch(featureFlag: string): void {
    if (!this.dispatcher) return;

    const payload = {
      featureFlag
    };

    this.dispatcher.formRequestAndDispatch(
      this.requestType,
      this.requestVersion,
      payload
    );
  }

  constructor(appObject: AppObject) {
    super(appObject, DispatchEnableFeatureUC.type);

    if (!this.dispatcher) {
      this.error(
        "UC has been added to an App Object that does not have a HostDispatchEntity. Add a dispatcher first"
      );
      this.dispose();
    }
  }
}
