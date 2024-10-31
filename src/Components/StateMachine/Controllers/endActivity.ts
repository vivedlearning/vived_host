import { HostAppObjectRepo } from "../../../HostAppObject";
import { EndActivityUC } from "../UCs/EndActivityUC";

export function endActivity(appObjects: HostAppObjectRepo) {
  const uc = EndActivityUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning(
      "endActivity Controller",
      "Unable to find EndActivityUC"
    );
    return;
  }

  uc.end();
}
