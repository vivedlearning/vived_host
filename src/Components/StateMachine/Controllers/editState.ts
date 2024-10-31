import { HostAppObjectRepo } from "../../../HostAppObject";
import { EditStateUC } from "../UCs/EditStateUC";

export function editState(id: string, appObjects: HostAppObjectRepo) {
  const uc = EditStateUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning("editState", "Unable to find EditStateUC");
    return;
  }

  uc.edit(id);
}
