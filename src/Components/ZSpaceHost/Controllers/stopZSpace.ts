import { AppObjectRepo } from "@vived/core";
import { StopZSpaceUC } from "../UCs";

export function stopZSpace(appObjects: AppObjectRepo) {
  const uc = StopZSpaceUC.get(appObjects);
  if (!uc) {
    appObjects.submitError("stopZSpace", "Unable to find StartZSpaceUC");
    return;
  }

  uc.stopZSpace();
}
