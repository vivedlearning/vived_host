import { AppObjectRepo } from "@vived/core";
import { CancelEditingUC } from "../UCs/CancelEditing/CancelEditingUC";

export function cancelEditing(appObjects: AppObjectRepo) {
  const uc = CancelEditingUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning("cancelEditing", "Unable to find CancelEditingUC");
    return;
  }

  uc.cancel();
}
