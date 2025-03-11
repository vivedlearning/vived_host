import { AppObjectRepo, PmAdapter } from "@vived/core";
import { AlertDialogPM, AlertDialogVM, defaultAlertDialogVM } from "../PMs";

export const alertDialogAdapter: PmAdapter<AlertDialogVM> = {
  defaultVM: defaultAlertDialogVM,
  subscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: AlertDialogVM) => void
  ) => {
    const pm = AlertDialogPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("alertDialogAdapter", "Unable to find PM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: AlertDialogVM) => void
  ) => {
    const pm = AlertDialogPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("alertDialogAdapter", "Unable to find PM");
      return;
    }
    pm.removeView(setVM);
  }
};
