import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectPM,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { ZSpaceHostEntity } from "../Entities";

export abstract class EmulateZSpacePM extends HostAppObjectPM<boolean> {
  static type = "EmulateZSpacePM";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<EmulateZSpacePM>(
      EmulateZSpacePM.type,
      appObjects
    );
  }
}

export function makeEmulateZSpacePM(appObject: HostAppObject): EmulateZSpacePM {
  return new EmulateZSpacePMImp(appObject);
}

class EmulateZSpacePMImp extends EmulateZSpacePM {
  private zSpace?: ZSpaceHostEntity;

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  private onEntityChange = () => {
    if (!this.zSpace) return;

    this.doUpdateView(this.zSpace.emulate);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, EmulateZSpacePM.type);

    this.zSpace = appObject.getComponent<ZSpaceHostEntity>(
      ZSpaceHostEntity.type
    );
    if (!this.zSpace) {
      this.error(
        "PM Has been added to an app object that does not have a ZSpaceHostEntity"
      );
      return;
    }
    this.zSpace.addChangeObserver(this.onEntityChange);
    this.onEntityChange();

    this.appObjects.registerSingleton(this);
  }
}
