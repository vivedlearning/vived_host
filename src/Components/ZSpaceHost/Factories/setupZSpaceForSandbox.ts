import { AppObjectRepo } from "@vived/core";
import { makeZSpaceHostEntity, ZSpaceHostEntity } from "../Entities";
import { makeEmulateZSpacePM, makeZSpaceIsActivePM } from "../PMs";
import { makeStartSandboxZSpaceUC, makeStopSandboxZSpaceUC } from "../UCs";

export function setupZSpaceForSandbox(
  appObjects: AppObjectRepo
): ZSpaceHostEntity {
  const ao = appObjects.getOrCreate("zSpace");

  // Entity
  const entity = makeZSpaceHostEntity(ao);

  // UC
  makeStopSandboxZSpaceUC(ao);
  makeStartSandboxZSpaceUC(ao);

  // PMs
  makeEmulateZSpacePM(ao);
  makeZSpaceIsActivePM(ao);

  return entity;
}
