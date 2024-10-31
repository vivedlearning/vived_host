import { HostAppObjectRepo } from "../../../HostAppObject";
import { TransitionToStateUC } from "../UCs/TransitionToStateUC";

export function transitionToState(
  stateID: string,
  appObjects: HostAppObjectRepo
) {
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
