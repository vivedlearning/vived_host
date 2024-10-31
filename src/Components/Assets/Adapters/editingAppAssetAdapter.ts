import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { EditingAppAssetPM, EditingAppAssetVM } from "../PMs/EditingAppAssetPM";

export const editingAppAssetAdapter: SingletonPmAdapter<
  EditingAppAssetVM | undefined
> = {
  defaultVM: undefined,
  subscribe: (
    appObjects: HostAppObjectRepo,
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
    appObjects: HostAppObjectRepo,
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
