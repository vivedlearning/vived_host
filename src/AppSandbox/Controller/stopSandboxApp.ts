import { AppObjectRepo } from "@vived/core";
import { StopAppUC } from "../../Apps/UCs/StopAppUC";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function stopSandboxApp(appObjects: AppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (!sandbox) {
    appObjects.submitWarning(
      "stopSandboxApp",
      "Could not find AppSandboxEntity"
    );
    return;
  }

  StopAppUC.stopByID(sandbox.appID, appObjects);
}
