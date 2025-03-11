import { AppObjectRepo } from "@vived/core";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function setSandboxAppContainer(
  container: HTMLDivElement,
  appObjects: AppObjectRepo
) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.appContainer = container;
  }
}
