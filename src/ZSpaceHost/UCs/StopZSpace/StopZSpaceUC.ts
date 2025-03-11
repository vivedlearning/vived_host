import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class StopZSpaceUC extends AppObjectUC {
  static type = "StopZSpaceUC";

  abstract stopZSpace(): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<StopZSpaceUC>(StopZSpaceUC.type, appObjects);
  }
}
