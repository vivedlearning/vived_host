import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { ZSpaceIsActivePM } from "../PMs/ZSpaceIsActivePM";

export const zSpaceIsActiveAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: HostAppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = ZSpaceIsActivePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "zSpaceIsActiveAdapter",
        "Unable to find ZSpaceIsActivePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: boolean) => void
  ) => {
    const pm = ZSpaceIsActivePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "zSpaceIsActiveAdapter",
        "Unable to find ZSpaceIsActivePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
