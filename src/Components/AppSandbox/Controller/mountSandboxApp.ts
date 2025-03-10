import { AppObjectRepo } from "@vived/core";
import { MounterUC } from "../../Apps/UCs/Mounters/MounterUC";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function mountSandboxApp(appObjects: AppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (!sandbox) {
    appObjects.submitWarning(
      "mountSandboxApp",
      "Could not find AppSandboxEntity"
    );
    return;
  }

  const mountUC = MounterUC.getById(sandbox.appID, appObjects);
  if (!mountUC) {
    appObjects.submitWarning("mountSandboxApp", "Could not find MounterUC");
    return;
  }

  mountUC.mountLatestVersion();
}
