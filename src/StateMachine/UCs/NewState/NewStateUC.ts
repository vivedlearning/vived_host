import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class NewStateUC extends AppObjectUC {
  static type = "NewStateUC";

  abstract createState(): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<NewStateUC>(NewStateUC.type, appObjects);
  }
}
