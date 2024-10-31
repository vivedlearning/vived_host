import { HostAppObjectRepo } from "../../../HostAppObject";
import { CancelEditingUC } from "../UCs/CancelEditingUC";

export function cancelEditing(appObjects: HostAppObjectRepo) {
  const uc = CancelEditingUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning("cancelEditing", "Unable to find CancelEditingUC");
    return;
  }

  uc.cancel();
}
