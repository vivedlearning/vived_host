import { AppObjectRepo } from "@vived/core";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";
import { ShowBabylonInspectorUC } from "../UCs/ShowBabylonInspectorUC";

export function toggleShowInspector(appObjects: AppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (!sandbox) {
    appObjects.submitWarning(
      "toggleShowInspector",
      "Could not find AppSandboxEntity"
    );
    return;
  }

  const uc = ShowBabylonInspectorUC.getByID(sandbox.appID, appObjects);
  if (!uc) {
    appObjects.submitWarning(
      "toggleShowInspector",
      "Could not find ShowBabylonInspectorUC"
    );
    return;
  }

  uc.toggleShow();
}
