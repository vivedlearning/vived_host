import { AppObjectRepo } from "@vived/core";
import { DuplicateStateUC } from "../UCs/DuplicateStateUC";

export function duplicateState(id: string, appObjects: AppObjectRepo) {
  const uc = DuplicateStateUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "duplicateState",
      "Unable to find DuplicateStateUC"
    );
    return;
  }

  uc.duplicateState(id);
}
