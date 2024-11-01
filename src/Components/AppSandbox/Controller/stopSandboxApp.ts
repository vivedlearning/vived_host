import { HostAppObjectRepo } from "../../../HostAppObject";
import { StopAppUC } from "../../Apps";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function stopSandboxApp(appObjects: HostAppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (!sandbox) {
    appObjects.submitWarning("stopSandboxApp", "Could not find AppSandboxEntity");
    return;
  }

  StopAppUC.stopByID(sandbox.appID, appObjects);
}
