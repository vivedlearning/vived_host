import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class EndActivityUC extends AppObjectUC {
  static type = "EndActivityUC";

  abstract end(): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<EndActivityUC>(EndActivityUC.type, appObjects);
  }
}
