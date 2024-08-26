import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { AppsListPM } from "../PMs/AppsListPM";

export const appListPMAdapter: SingletonPmAdapter<string[]> = {
  defaultVM: [],
  subscribe: (appObjects: HostAppObjectRepo, setVM: (vm: string[]) => void) => {
    const pm = AppsListPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "appListPMAdapter",
        "Unable to find AppsListPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: string[]) => void
  ) => {
    const pm = AppsListPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "appListPMAdapter",
        "Unable to find AppsListPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
