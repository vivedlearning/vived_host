import { AppObjectRepo } from "@vived/core";
import { DeleteStateUC } from "../UCs";

export function deleteState(id: string, appObjects: AppObjectRepo) {
  const uc = DeleteStateUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("duplicateState", "Unable to find DeleteStateUC");
    return;
  }

  uc.deleteState(id);
}
