import { AppObjectRepo } from "@vived/core";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function clearSandboxAppContainer(appObjects: AppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.appContainer = undefined;
  }
}
