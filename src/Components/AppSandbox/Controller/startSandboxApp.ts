import { AppObjectRepo } from "@vived/core";
import { StartAppUC } from "../../Apps/UCs/StartAppUC";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function startSandboxApp(
  container: HTMLElement,
  appObjects: AppObjectRepo
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
