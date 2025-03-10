import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class SaveAuthoringUC extends AppObjectUC {
  static type = "SaveAuthoringUC";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<SaveAuthoringUC>(
      SaveAuthoringUC.type,
      appObjects
    );
  }

  abstract saveAuthoring(): void;
}
