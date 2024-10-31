import {
  getSingletonComponent,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../HostAppObject";

export abstract class EditStateUC extends HostAppObjectUC {
  static type = "EditStateUC";

  abstract edit(id: string): void;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<EditStateUC>(EditStateUC.type, appObjects);
  }
}
