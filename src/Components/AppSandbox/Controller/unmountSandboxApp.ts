import { HostAppObjectRepo } from "../../../HostAppObject";
import { MounterUC } from "../../Apps";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function unmountSandboxApp(appObjects: HostAppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (!sandbox) {
    appObjects.submitWarning(
      "unmountSandboxApp",
      "Could not find AppSandboxEntity"
    );
    return;
  }

  const mountUC = MounterUC.getById(sandbox.appID, appObjects);
  if (!mountUC) {
    appObjects.submitWarning("unmountSandboxApp", "Could not find MounterUC");
    return;
  }

  mountUC.unmount();
}
