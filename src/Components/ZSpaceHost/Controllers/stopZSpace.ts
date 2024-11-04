import { HostAppObjectRepo } from "../../../HostAppObject";
import { StopZSpaceUC } from "../UCs";


export function stopZSpace(appObjects: HostAppObjectRepo) {
  const uc = StopZSpaceUC.get(appObjects);
  if (!uc) {
    appObjects.submitError("stopZSpace", "Unable to find StartZSpaceUC");
    return;
  }

  uc.stopZSpace();
}
