import { getSingletonComponent, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";

export abstract class TransitionToStateUC extends HostAppObjectUC {
  static type = "TransitionToStateUC";

  abstract transitionToState(id: string): void;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<TransitionToStateUC>(
      TransitionToStateUC.type,
      appObjects
    );
  }
}
