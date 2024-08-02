import { HostAppObjectRepo } from "../../../HostAppObject";
import { ReactHookPmAdapter } from "../../../Types/ReactHookPmAdapter";
import {
  defaultIsEditingStateVM,
  EditingStatePM,
  EditingStateVM
} from "../PMs";

export const isEditingPMAdapter: ReactHookPmAdapter<EditingStateVM> = {
  defaultVM: defaultIsEditingStateVM,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: EditingStateVM) => void
  ) => {
    const pm = EditingStatePM.get(appObjects);
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
    setVM: (vm: EditingStateVM) => void
  ) => {
    const pm = EditingStatePM.get(appObjects);
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
