import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class CancelEditingUC extends AppObjectUC {
  static type = "CancelEditingUC";

  abstract cancel(): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<CancelEditingUC>(
      CancelEditingUC.type,
      appObjects
    );
  }
}
