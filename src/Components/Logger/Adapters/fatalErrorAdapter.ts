import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { defaultFatalErrorVM, FatalErrorPM, FatalErrorVM } from "../PMs";

export const fatalErrorAdapter: SingletonPmAdapter<FatalErrorVM> = {
  defaultVM: defaultFatalErrorVM,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: FatalErrorVM) => void
  ) => {
    const pm = FatalErrorPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("appListPMAdapter", "Unable to find AppsListPM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: FatalErrorVM) => void
  ) => {
    const pm = FatalErrorPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("appListPMAdapter", "Unable to find AppsListPM");
      return;
    }
    pm.removeView(setVM);
  }
};
