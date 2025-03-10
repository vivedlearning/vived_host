import { AppObjectRepo } from "@vived/core";
import { AppSandboxEntity } from "../Entities/AppSandboxEntity";

export function toggleStartInZSpace(appObjects: AppObjectRepo) {
  const sandbox = AppSandboxEntity.get(appObjects);
  if (sandbox) {
    sandbox.startInZSpace = !sandbox.startInZSpace;
  }
}
