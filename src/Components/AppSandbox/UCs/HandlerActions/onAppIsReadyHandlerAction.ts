import { HostAppObjectRepo } from "../../../../HostAppObject";
import {
  AppSandboxEntity,
  SandboxState
} from "../../Entities/AppSandboxEntity";

export function makeOnAppIsReadyHandlerAction(
  appObjects: HostAppObjectRepo
): () => void {
  return function (): void {
    const sandbox = AppSandboxEntity.get(appObjects);
    if (!sandbox) {
      appObjects.submitWarning(
        "OnAppIsReadyHandlerAction",
        "Could not find AppSandboxEntity"
      );
      return;
    }

    sandbox.state = SandboxState.MOUNTED;
  };
}
