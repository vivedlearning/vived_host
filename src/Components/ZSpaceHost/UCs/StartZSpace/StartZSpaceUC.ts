import {
  getSingletonComponent,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../../HostAppObject";

export abstract class StartZSpaceUC extends HostAppObjectUC {
  static type = "StartZSpaceUC";

  abstract startZSpace(): Promise<void>;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<StartZSpaceUC>(StartZSpaceUC.type, appObjects);
  }
}
