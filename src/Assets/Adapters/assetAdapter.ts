import { AppObjectRepo, PmAdapter } from "@vived/core";
import { defaultAssetVM, AssetPM, AssetVM } from "../PMs/AssetPM";

export const assetAdapter: PmAdapter<AssetVM> = {
  defaultVM: defaultAssetVM,
  subscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: AssetVM) => void
  ) => {
    const pm = AssetPM.getByID(id, appObjects);
    if (!pm) {
      appObjects.submitError("assetAdapter", "Unable to find AssetPM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: AssetVM) => void
  ) => {
    const pm = AssetPM.getByID(id, appObjects);
    if (!pm) {
      appObjects.submitError("assetAdapter", "Unable to find AssetPM");
      return;
    }
    pm.removeView(setVM);
  }
};
