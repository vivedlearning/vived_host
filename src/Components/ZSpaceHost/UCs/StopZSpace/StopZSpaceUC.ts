import { getSingletonComponent, HostAppObjectRepo, HostAppObjectUC } from "../../../../HostAppObject";


export abstract class StopZSpaceUC extends HostAppObjectUC {
  static type = "StopZSpaceUC";

  abstract stopZSpace(): void;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<StopZSpaceUC>(StopZSpaceUC.type, appObjects);
  }
}
