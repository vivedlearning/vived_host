import { HostAppObjectRepo } from "../../../HostAppObject";
import { SavePersistentStatesUC } from "../UCs/SavePersistentStates";

export function savePersistentStates(appObjects: HostAppObjectRepo) {
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
