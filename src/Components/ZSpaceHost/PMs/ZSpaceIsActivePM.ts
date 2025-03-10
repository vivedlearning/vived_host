import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { ZSpaceHostEntity } from "../Entities/ZSpaceHost";

export abstract class ZSpaceIsActivePM extends AppObjectPM<boolean> {
  static type = "ZSpaceIsActivePM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ZSpaceIsActivePM>(
      ZSpaceIsActivePM.type,
      appObjects
    );
  }
}

export function makeZSpaceIsActivePM(appObject: AppObject): ZSpaceIsActivePM {
  return new ZSpaceIsActivePMImp(appObject);
}

class ZSpaceIsActivePMImp extends ZSpaceIsActivePM {
  private zSpace?: ZSpaceHostEntity;

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  private onEntityChange = () => {
    if (!this.zSpace) return;

    this.doUpdateView(this.zSpace.isActive);
  };

  constructor(appObject: AppObject) {
    super(appObject, ZSpaceIsActivePM.type);

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
