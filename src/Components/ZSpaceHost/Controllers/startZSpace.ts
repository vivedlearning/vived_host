import { HostAppObjectRepo } from "../../../HostAppObject";
import { StartZSpaceUC } from "../UCs/StartZSpaceUC";

export function startZSpace(appObjects: HostAppObjectRepo) {
  const uc = StartZSpaceUC.get(appObjects);
  if (!uc) {
    appObjects.submitError("startZSpace", "Unable to find StartZSpaceUC");
    return;
  }

  uc.startZSpace();
}
