import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { defaultDialogVM, DialogQueuePM, DialogQueueVM } from "../PMs";

export const dialogQueueAdapter: SingletonPmAdapter<DialogQueueVM> = {
  defaultVM: defaultDialogVM,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: DialogQueueVM) => void
  ) => {
    const pm = DialogQueuePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "dialogQueueAdapter",
        "Unable to find DialogQueuePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: DialogQueueVM) => void
  ) => {
    const pm = DialogQueuePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "dialogQueueAdapter",
        "Unable to find DialogQueuePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
