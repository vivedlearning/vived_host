import { HostAppObjectRepo } from "../../../HostAppObject";
import { PmAdapter } from "../../../Types/PmAdapter";
import {
  SpinnerDialogPM,
  SpinnerDialogVM,
  defaultSpinnerDialogVM
} from "../PMs";

export const spinnerDialogAdapter: PmAdapter<SpinnerDialogVM> = {
  defaultVM: defaultSpinnerDialogVM,
  subscribe: (
    id: string,
    appObjects: HostAppObjectRepo,
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
    appObjects: HostAppObjectRepo,
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
