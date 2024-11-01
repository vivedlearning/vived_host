import {
  getSingletonComponent,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../../HostAppObject";

export abstract class EndActivityUC extends HostAppObjectUC {
  static type = "EndActivityUC";

  abstract end(): void;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<EndActivityUC>(EndActivityUC.type, appObjects);
  }
}
