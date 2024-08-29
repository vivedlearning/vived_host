import { HostAppObjectRepo } from "../../../HostAppObject";
import { PmAdapter } from "../../../Types/PmAdapter";
import {
  ConfirmDialogVM,
  ConfirmDialogPM,
  defaultConfirmDialogVM
} from "../PMs";

export const confirmDialogAdapter: PmAdapter<ConfirmDialogVM> = {
  defaultVM: defaultConfirmDialogVM,
  subscribe: (
    id: string,
    appObjects: HostAppObjectRepo,
    setVM: (vm: ConfirmDialogVM) => void
  ) => {
    const pm = ConfirmDialogPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("confirmDialogAdapter", "Unable to find PM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    id: string,
    appObjects: HostAppObjectRepo,
    setVM: (vm: ConfirmDialogVM) => void
  ) => {
    const pm = ConfirmDialogPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("confirmDialogAdapter", "Unable to find PM");
      return;
    }
    pm.removeView(setVM);
  }
};
