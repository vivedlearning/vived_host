import { HostAppObjectRepo } from "../../../HostAppObject";
import { EditActiveStateUC } from "../UCs/EditActiveState/EditActiveStateUC";

export function editActiveState(appObjects: HostAppObjectRepo) {
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
