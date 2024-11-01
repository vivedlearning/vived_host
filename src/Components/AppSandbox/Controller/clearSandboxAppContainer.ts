import { HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function clearSandboxAppContainer(appObjects: HostAppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.appContainer = undefined;
  }
}
