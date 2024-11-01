import {
  getSingletonComponent,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../../HostAppObject";

export abstract class NewStateUC extends HostAppObjectUC {
  static type = "NewStateUC";

  abstract createState(): void;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<NewStateUC>(NewStateUC.type, appObjects);
  }
}
