import { HostAppObjectRepo } from "../../../HostAppObject";
import { DuplicateStateUC } from "../UCs/DuplicateStateUC";

export function duplicateState(id: string, appObjects: HostAppObjectRepo) {
  const uc = DuplicateStateUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "duplicateState",
      "Unable to find DuplicateStateUC"
    );
    return;
  }

  uc.duplicateState(id);
}
