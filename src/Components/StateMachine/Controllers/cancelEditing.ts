import { HostAppObjectRepo } from "../../../HostAppObject";
import { CancelEditingUC } from "../UCs/CancelEditing/CancelEditingUC";

export function cancelEditing(appObjects: HostAppObjectRepo) {
  const uc = CancelEditingUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning("cancelEditing", "Unable to find CancelEditingUC");
    return;
  }

  uc.cancel();
}
