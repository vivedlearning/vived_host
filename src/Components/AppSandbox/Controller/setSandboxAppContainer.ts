import { HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function setSandboxAppContainer(
  container: HTMLDivElement,
  appObjects: HostAppObjectRepo
) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.appContainer = container;
  }
}
