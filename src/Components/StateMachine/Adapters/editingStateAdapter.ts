import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types/SingletonPmAdapter";
import {
  EditingStatePM,
  EditingStateVM,
  defaultIsEditingStateVM
} from "../PMs/EditingStatePM";

export const editingStateAdapter: SingletonPmAdapter<EditingStateVM> = {
  defaultVM: defaultIsEditingStateVM,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: EditingStateVM) => void
  ) => {
    const pm = EditingStatePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "editingStateAdapter",
        "Unable to find EditingStatePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: EditingStateVM) => void
  ) => {
    const pm = EditingStatePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "editingStateAdapter",
        "Unable to find EditingStatePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
