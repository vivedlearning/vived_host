import { AppObjectRepo } from "@vived/core";
import { ZSpaceHostEntity } from "../Entities";

export function toggleEmulateZSpace(appObjects: AppObjectRepo) {
  const zSpace = ZSpaceHostEntity.get(appObjects);
  if (!zSpace) {
    appObjects.submitError(
      "toggleEmulateZSpace",
      "Unable to find ZSpaceHostEntity"
    );
    return;
  }

  zSpace.emulate = !zSpace.emulate;
}
