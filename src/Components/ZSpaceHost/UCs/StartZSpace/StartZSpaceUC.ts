import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class StartZSpaceUC extends AppObjectUC {
  static type = "StartZSpaceUC";

  abstract startZSpace(): Promise<void>;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<StartZSpaceUC>(StartZSpaceUC.type, appObjects);
  }
}
