import { HostAppObjectRepo } from "../../../HostAppObject";
import { PmAdapter } from "../../../Types/PmAdapter";
import { AppPM, AppVM, defaultAppVM } from "../PMs/AppPM";

export const appPMAdapter: PmAdapter<AppVM> = {
  defaultVM: defaultAppVM,
  subscribe: (
    id: string,
    appObjects: HostAppObjectRepo,
    setVM: (vm: AppVM) => void
  ) => {
    const pm = AppPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("appPMAdapter", "Unable to find AppsListPM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    id: string,
    appObjects: HostAppObjectRepo,
    setVM: (vm: AppVM) => void
  ) => {
    const pm = AppPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError("appPMAdapter", "Unable to find AppsListPM");
      return;
    }
    pm.removeView(setVM);
  }
};
