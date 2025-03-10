import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { ShowArchivedAppAssetPM } from "../PMs/ShowArchivedAppAssetPM";

export const showArchivedAppAssetAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = ShowArchivedAppAssetPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "showArchivedAppAssetAdapter",
        "Unable to find ShowArchivedAppAssetPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = ShowArchivedAppAssetPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "showArchivedAppAssetAdapter",
        "Unable to find ShowArchivedAppAssetPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
