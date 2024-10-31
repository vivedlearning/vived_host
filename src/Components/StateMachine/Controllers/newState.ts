import { HostAppObjectRepo } from "../../../HostAppObject";
import { NewStateUC } from "../UCs/NewStateUC";

export function newState(appObjects: HostAppObjectRepo) {
  const uc = NewStateUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning(
      "newState",
      "Unable to find NewStateUC"
    );
    return;
  }

  uc.createState();
}
