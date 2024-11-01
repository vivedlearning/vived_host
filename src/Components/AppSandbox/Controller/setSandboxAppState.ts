import { HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity, SandboxState } from "../Entities/AppSandboxEntity";

export function setSandboxAppState(
  state: SandboxState,
  appObjects: HostAppObjectRepo
) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.state = state;
  }
}
