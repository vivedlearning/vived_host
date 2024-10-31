import {
  getSingletonComponent,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";

export abstract class SaveAuthoringUC extends HostAppObjectUC {
  static type = "SaveAuthoringUC";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<SaveAuthoringUC>(
      SaveAuthoringUC.type,
      appObjects
    );
  }

  abstract saveAuthoring(): void;
}
