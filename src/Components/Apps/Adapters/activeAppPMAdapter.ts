import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import {
  ActiveAppPM,
  ActiveAppVM,
  defaultActiveAppVM
} from "../PMs/ActiveAppPM";

export const activeAppPMAdapter: SingletonPmAdapter<ActiveAppVM> = {
  defaultVM: defaultActiveAppVM,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: ActiveAppVM) => void
  ) => {
    const pm = ActiveAppPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "activeAppPMAdapter",
        "Unable to find ActiveAppPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: ActiveAppVM) => void
  ) => {
    const pm = ActiveAppPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "activeAppPMAdapter",
        "Unable to find ActiveAppPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
