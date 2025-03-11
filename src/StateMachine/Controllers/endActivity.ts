import { AppObjectRepo } from "@vived/core";
import { EndActivityUC } from "../UCs/EndActivity/EndActivityUC";

export function endActivity(appObjects: AppObjectRepo) {
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
