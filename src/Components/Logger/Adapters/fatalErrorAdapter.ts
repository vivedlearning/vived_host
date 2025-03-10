import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { defaultFatalErrorVM, FatalErrorPM, FatalErrorVM } from "../PMs";

export const fatalErrorAdapter: SingletonPmAdapter<FatalErrorVM> = {
  defaultVM: defaultFatalErrorVM,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: FatalErrorVM) => void) => {
    const pm = FatalErrorPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("appListPMAdapter", "Unable to find AppsListPM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: AppObjectRepo,
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
