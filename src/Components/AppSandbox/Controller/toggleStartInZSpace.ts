import { HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function toggleStartInZSpace(appObjects: HostAppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.startInZSpace = !sandbox.startInZSpace;
  }
}
