import { AppObjectRepo } from "@vived/core";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function toggleAllowDevFeatures(appObjects: AppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.enableDevFeatures = !sandbox.enableDevFeatures;
  }
}
