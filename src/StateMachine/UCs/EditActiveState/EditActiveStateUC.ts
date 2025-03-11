import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class EditActiveStateUC extends AppObjectUC {
  static type = "EditActiveStateUC";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<EditActiveStateUC>(
      EditActiveStateUC.type,
      appObjects
    );
  }

  abstract editActiveState(): void;
}
