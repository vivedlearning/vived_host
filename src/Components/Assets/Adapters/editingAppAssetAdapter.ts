import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { EditingAppAssetPM, EditingAppAssetVM } from "../PMs/EditingAppAssetPM";

export const editingAppAssetAdapter: SingletonPmAdapter<
  EditingAppAssetVM | undefined
> = {
  defaultVM: undefined,
  subscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: EditingAppAssetVM | undefined) => void
  ) => {
    const pm = EditingAppAssetPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "editingAppAssetAdapter",
        "Unable to find EditingAppAssetPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: EditingAppAssetVM | undefined) => void
  ) => {
    const pm = EditingAppAssetPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "editingAppAssetAdapter",
        "Unable to find EditingAppAssetPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
