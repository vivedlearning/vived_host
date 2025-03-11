import { AppObjectRepo, PmAdapter } from "@vived/core";
import {
  SpinnerDialogPM,
  SpinnerDialogVM,
  defaultSpinnerDialogVM
} from "../PMs";

export const spinnerDialogAdapter: PmAdapter<SpinnerDialogVM> = {
  defaultVM: defaultSpinnerDialogVM,
  subscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: SpinnerDialogVM) => void
  ) => {
    const pm = SpinnerDialogPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("spinnerDialogAdapter", "Unable to find PM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: SpinnerDialogVM) => void
  ) => {
    const pm = SpinnerDialogPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("spinnerDialogAdapter", "Unable to find PM");
      return;
    }
    pm.removeView(setVM);
  }
};
