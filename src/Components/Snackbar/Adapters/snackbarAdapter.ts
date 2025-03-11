import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { SnackbarPM, SnackbarVM, defaultSnackbarVM } from "../PMs/SnackbarPM";

export const snackbarAdapter: SingletonPmAdapter<SnackbarVM> = {
  defaultVM: defaultSnackbarVM,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: SnackbarVM) => void) => {
    const pm = SnackbarPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("snackbarAdapter", "Unable to find SnackbarPM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: SnackbarVM) => void) => {
    const pm = SnackbarPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("snackbarAdapter", "Unable to find SnackbarPM");
      return;
    }
    pm.removeView(setVM);
  }
};
