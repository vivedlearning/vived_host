import { AppObjectRepo } from "@vived/core";
import { StartZSpaceUC } from "../UCs/StartZSpace/StartZSpaceUC";

export function startZSpace(appObjects: AppObjectRepo) {
  const uc = StartZSpaceUC.get(appObjects);
  if (!uc) {
    appObjects.submitError("startZSpace", "Unable to find StartZSpaceUC");
    return;
  }

  uc.startZSpace();
}
