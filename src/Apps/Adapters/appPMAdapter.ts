import { AppObjectRepo, PmAdapter } from "@vived/core";
import { AppPM, AppVM, defaultAppVM } from "../PMs/AppPM";

export const appPMAdapter: PmAdapter<AppVM> = {
  defaultVM: defaultAppVM,
  subscribe: (
    id: string,
    appObjects: AppObjectRepo,
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
    appObjects: AppObjectRepo,
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
