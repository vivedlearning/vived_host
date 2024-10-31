import { HostAppObjectRepo } from "../../../HostAppObject";
import { PmAdapter } from "../../../Types/PmAdapter";
import { defaultAssetVM, AssetPM, AssetVM } from "../PMs/AssetPM";

export const assetAdapter: PmAdapter<AssetVM> = {
  defaultVM: defaultAssetVM,
  subscribe: (
    id: string,
    appObjects: HostAppObjectRepo,
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
    appObjects: HostAppObjectRepo,
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
