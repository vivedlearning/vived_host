import { HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function toggleAllowDevFeatures(appObjects: HostAppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.enableDevFeatures = !sandbox.enableDevFeatures;
  }
}
