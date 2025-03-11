import { AppObjectRepo } from "@vived/core";
import { AppSandboxEntity, SandboxState } from "../Entities/AppSandboxEntity";

export function setSandboxAppState(
  state: SandboxState,
  appObjects: AppObjectRepo
) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.state = state;
  }
}
