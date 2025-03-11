import { AppObjectRepo } from "@vived/core";
import { AppAssetsEntity } from "../Entities/AppAssetsEntity";

export function toggleShowArchivedAssets(appObjects: AppObjectRepo) {
  const appAssets = AppAssetsEntity.get(appObjects);

  if (appAssets) {
    appAssets.showArchived = !appAssets.showArchived;
  } else {
    appObjects.submitWarning(
      "toggleShowArchivedAssets",
      "Unable to find AppAssetsEntity"
    );
  }
}
