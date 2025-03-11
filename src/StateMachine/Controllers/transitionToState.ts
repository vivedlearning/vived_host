import { AppObjectRepo } from "@vived/core";
import { TransitionToStateUC } from "../UCs/TransitionToState/TransitionToStateUC";

export function transitionToState(stateID: string, appObjects: AppObjectRepo) {
  const uc = TransitionToStateUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning(
      "transitionToState Controller",
      "Unable to find TransitionToStateUC"
    );
    return;
  }

  uc.transitionToState(stateID);
}
