import { HostAppObjectRepo } from "../../../HostAppObject";
import { DeleteStateUC } from "../UCs";

export function deleteState(id: string, appObjects: HostAppObjectRepo) {
  const uc = DeleteStateUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning("duplicateState", "Unable to find DeleteStateUC");
    return;
  }

  uc.deleteState(id);
}
