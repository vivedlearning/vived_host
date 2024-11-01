import {
  getSingletonComponent,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../../HostAppObject";

export abstract class CancelEditingUC extends HostAppObjectUC {
  static type = "CancelEditingUC";

  abstract cancel(): void;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<CancelEditingUC>(
      CancelEditingUC.type,
      appObjects
    );
  }
}
