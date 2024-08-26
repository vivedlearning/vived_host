import { HostAppObjectRepo } from "../../../HostAppObject";
import { UpdateAppUC } from "../UCs/UpdateAppUC";

export function updateApp(id: string, appObjects: HostAppObjectRepo) {
  const uc = UpdateAppUC.getByID(id, appObjects);
  if (!uc) {
    appObjects.submitError("updateApp", "Unable to find UpdateAppUC");
    return;
  }

  uc.updateApp();
}
