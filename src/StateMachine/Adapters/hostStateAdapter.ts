import { AppObjectRepo, PmAdapter } from "@vived/core";
import { HostStatePM, HostStateVM } from "../PMs/HostStatePM";

export const hostStateAdapter: PmAdapter<HostStateVM> = {
  defaultVM: HostStatePM.defaultVM,
  subscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: HostStateVM) => void
  ) => {
    if (!id) {
      appObjects.submitWarning(
        "hostStateAdapter",
        "Missing ID for hostStateAdapter"
      );
      return;
    }

    const pm = HostStatePM.getById(id, appObjects);
    if (!pm) {
      appObjects.submitError(
        "hostStateAdapter",
        `Unable to find HostStatePM for ID: ${id}`
      );
      return;
    }

    pm.addView(setVM);
  },
  unsubscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: HostStateVM) => void
  ) => {
    if (!id) return;

    HostStatePM.getById(id, appObjects)?.removeView(setVM);
  }
};
