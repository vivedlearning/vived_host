import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types/SingletonPmAdapter";
import {
  HostStateMachineVM,
  defaultHostStateMachineVM,
  HostStateMachinePM
} from "../PMs";

export const hostStateMachinePMAdapter: SingletonPmAdapter<HostStateMachineVM> = {
  defaultVM: defaultHostStateMachineVM,
  subscribe: (
    appObjects: HostAppObjectRepo,
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
    appObjects: HostAppObjectRepo,
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
