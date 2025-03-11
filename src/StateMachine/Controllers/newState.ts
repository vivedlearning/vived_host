import { AppObjectRepo } from "@vived/core";
import { NewStateUC } from "../UCs/NewState/NewStateUC";

export function newState(appObjects: AppObjectRepo) {
  const uc = NewStateUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning("newState", "Unable to find NewStateUC");
    return;
  }

  uc.createState();
}
