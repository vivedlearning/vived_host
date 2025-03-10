import { AppObjectRepo } from "@vived/core";
import { SavePersistentStatesUC } from "../UCs/SavePersistentStates";

export function savePersistentStates(appObjects: AppObjectRepo) {
  const uc = SavePersistentStatesUC.get(appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "savePersistentStates",
      "Unable to find SavePersistentStatesUC"
    );
    return;
  }

  uc.saveLocally();
}
