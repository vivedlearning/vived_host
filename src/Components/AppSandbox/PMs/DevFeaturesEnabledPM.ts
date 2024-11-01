import { getSingletonComponent, HostAppObject, HostAppObjectPM, HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";


export abstract class DevFeaturesEnabledPM extends HostAppObjectPM<boolean> {
  static type = "DevFeaturesEnabledPM";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<DevFeaturesEnabledPM>(
      DevFeaturesEnabledPM.type,
      appObjects
    );
  }
}

export function makeDevFeaturesEnabledPM(
  appObject: HostAppObject
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

  constructor(appObject: HostAppObject) {
    super(appObject, DevFeaturesEnabledPM.type);
    this.appObjects.registerSingleton(this);

    this.sandbox?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
