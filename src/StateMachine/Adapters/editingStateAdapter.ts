import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import {
  EditingStatePM,
  EditingStateVM,
  defaultIsEditingStateVM
} from "../PMs/EditingStatePM";

export const editingStateAdapter: SingletonPmAdapter<EditingStateVM> = {
  defaultVM: defaultIsEditingStateVM,
  subscribe: (
    appObjects: AppObjectRepo,
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
    appObjects: AppObjectRepo,
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
