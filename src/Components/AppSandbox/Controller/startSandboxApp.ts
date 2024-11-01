import { HostAppObjectRepo } from "../../../HostAppObject";
import { StartAppUC } from "../../Apps";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function startSandboxApp(
  container: HTMLElement,
  appObjects: HostAppObjectRepo
) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (!sandbox) {
    appObjects.submitWarning(
      "startSandboxApp",
      "Could not find AppSandboxEntity"
    );
    return;
  }

  StartAppUC.startByID(container, sandbox.appID, appObjects);
}
