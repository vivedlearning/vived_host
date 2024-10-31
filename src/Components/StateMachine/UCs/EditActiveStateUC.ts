import { getSingletonComponent, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";


export abstract class EditActiveStateUC extends HostAppObjectUC {
  static type = "EditActiveStateUC";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<EditActiveStateUC>(
      EditActiveStateUC.type,
      appObjects
    );
  }

  abstract editActiveState(): void;
}
