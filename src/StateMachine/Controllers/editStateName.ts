import { AppObjectRepo } from "@vived/core";
import { EditStateNameUC } from "../UCs/EditStateNameUC";

export function editStateName(
  name: string,
  id: string,
  appObjects: AppObjectRepo
) {
  const uc = EditStateNameUC.getById(id, appObjects);
  if (!uc) {
    appObjects.submitWarning("editStateName", "Unable to find EditStateNameUC");
    return;
  }

  uc.editStateName(name);
}
