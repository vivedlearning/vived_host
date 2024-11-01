import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectPM,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export abstract class StartInZSpacePM extends HostAppObjectPM<boolean> {
  static type = "StartInZSpacePM";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<StartInZSpacePM>(
      StartInZSpacePM.type,
      appObjects
    );
  }
}

export function makeStartInZSpacePM(appObject: HostAppObject): StartInZSpacePM {
  return new StartInZSpacePMImp(appObject);
}

class StartInZSpacePMImp extends StartInZSpacePM {
  private get sandbox() {
    return this.getCachedSingleton<AppSandboxEntity>(AppSandboxEntity.type);
  }

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  onEntityChange = () => {
    if (!this.sandbox) return;

    this.doUpdateView(this.sandbox.startInZSpace);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, StartInZSpacePM.type);
    this.appObjects.registerSingleton(this);

    this.sandbox?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
