import { HostAppObjectRepo } from "../../../HostAppObject";
import { SaveAuthoringUC } from "../UCs/SaveAuthoring/SaveAuthoringUC";

export function saveAuthoring(appObjects: HostAppObjectRepo) {
  const uc = SaveAuthoringUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning(
      "saveAuthoring Controller",
      "Unable to find SaveAuthoringUC"
    );
    return;
  }

  uc.saveAuthoring();
}
