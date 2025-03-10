import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { ZSpaceHostEntity } from "../Entities";

export abstract class EmulateZSpacePM extends AppObjectPM<boolean> {
  static type = "EmulateZSpacePM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<EmulateZSpacePM>(
      EmulateZSpacePM.type,
      appObjects
    );
  }
}

export function makeEmulateZSpacePM(appObject: AppObject): EmulateZSpacePM {
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

  constructor(appObject: AppObject) {
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
