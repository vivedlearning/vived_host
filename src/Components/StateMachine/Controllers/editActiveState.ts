import { AppObjectRepo } from "@vived/core";
import { EditActiveStateUC } from "../UCs/EditActiveState/EditActiveStateUC";

export function editActiveState(appObjects: AppObjectRepo) {
  const uc = EditActiveStateUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning(
      "editActiveState Controller",
      "Unable to find EditActiveStateUC"
    );
    return;
  }

  uc.editActiveState();
}
