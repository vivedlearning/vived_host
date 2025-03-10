import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import {
  HostStateMachineVM,
  defaultHostStateMachineVM,
  HostStateMachinePM
} from "../PMs";

export const hostStateMachinePMAdapter: SingletonPmAdapter<HostStateMachineVM> = {
  defaultVM: defaultHostStateMachineVM,
  subscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: HostStateMachineVM) => void
  ) => {
    const pm = HostStateMachinePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "hostStateMachinePMAdapter",
        "Unable to find HostStateMachinePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: HostStateMachineVM) => void
  ) => {
    const pm = HostStateMachinePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "hostStateMachinePMAdapter",
        "Unable to find HostStateMachinePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
