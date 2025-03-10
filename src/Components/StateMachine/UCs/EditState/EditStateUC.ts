import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class EditStateUC extends AppObjectUC {
  static type = "EditStateUC";

  abstract edit(id: string): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<EditStateUC>(EditStateUC.type, appObjects);
  }
}
