import { AppObjectRepo } from "@vived/core";
import { ArchiveAssetUC } from "../UCs/ArchiveAssetUC";

export function archiveAsset(
  assetID: string,
  archive: boolean,
  appObjects: AppObjectRepo
): Promise<void> {
  const uc = ArchiveAssetUC.get(assetID, appObjects);
  if (!uc) {
    appObjects.submitWarning("archiveAsset", "Unable to find ArchiveAssetUC");
    return Promise.reject();
  }

  return uc.setArchived(archive);
}
