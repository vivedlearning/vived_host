import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export abstract class DevFeaturesEnabledPM extends AppObjectPM<boolean> {
  static type = "DevFeaturesEnabledPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<DevFeaturesEnabledPM>(
      DevFeaturesEnabledPM.type,
      appObjects
    );
  }
}

export function makeDevFeaturesEnabledPM(
  appObject: AppObject
): DevFeaturesEnabledPM {
  return new DevFeaturesEnabledPMImp(appObject);
}

class DevFeaturesEnabledPMImp extends DevFeaturesEnabledPM {
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  onEntityChange = () => {
    if (!this.sandbox) return;

    this.doUpdateView(this.sandbox.enableDevFeatures);
  };

  constructor(appObject: AppObject) {
    super(appObject, DevFeaturesEnabledPM.type);
    this.appObjects.registerSingleton(this);

    this.sandbox?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
