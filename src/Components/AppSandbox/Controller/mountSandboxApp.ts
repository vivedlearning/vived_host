import { HostAppObjectRepo } from "../../../HostAppObject";
import { MounterUC } from "../../Apps/UCs/Mounters/MounterUC";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function mountSandboxApp(appObjects: HostAppObjectRepo) {
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
