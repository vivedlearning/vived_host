import {
  getSingletonComponent,
  HostAppObject,
  HostAppObjectPM,
  HostAppObjectRepo
} from "../../../HostAppObject";
import { ZSpaceHostEntity } from "../Entities/ZSpaceHost";

export class ZSpaceIsActivePM extends HostAppObjectPM<boolean> {
  static type = "ZSpaceIsActivePM";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<ZSpaceIsActivePM>(
      ZSpaceIsActivePM.type,
      appObjects
    );
  }

  private zSpace?: ZSpaceHostEntity;

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  private onEntityChange = () => {
    if (!this.zSpace) return;

    this.doUpdateView(this.zSpace.isActive);
  };

  constructor(appObject: HostAppObject) {
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
