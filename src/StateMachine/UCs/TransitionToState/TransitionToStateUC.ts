import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class TransitionToStateUC extends AppObjectUC {
  static type = "TransitionToStateUC";

  abstract transitionToState(id: string): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<TransitionToStateUC>(
      TransitionToStateUC.type,
      appObjects
    );
  }
}
