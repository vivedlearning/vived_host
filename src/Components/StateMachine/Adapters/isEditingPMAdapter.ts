import { HostAppObjectRepo } from "../../../HostAppObject";
import { ReactHookPmAdapter } from "../../../Types/ReactHookPmAdapter";
import { defaultIsEditingStateVM, IsEditingStatePM, IsEditingStateVM } from "../PMs";

export const isEditingPMAdapter: ReactHookPmAdapter<IsEditingStateVM> = {
  defaultVM: defaultIsEditingStateVM,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: IsEditingStateVM) => void
  ) => {
    const pm = IsEditingStatePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "isEditingPMAdapter",
        "Unable to find HostStateMachinePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: IsEditingStateVM) => void
  ) => {
    const pm = IsEditingStatePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "isEditingPMAdapter",
        "Unable to find HostStateMachinePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
