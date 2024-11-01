import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { StartInZSpacePM } from "../PMs/StartInZSpacePM";

export const startInZSpaceAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: HostAppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = StartInZSpacePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "startInZSpaceAdapter",
        "Unable to find StartInZSpacePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: boolean) => void
  ) => {
    const pm = StartInZSpacePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "startInZSpaceAdapter",
        "Unable to find StartInZSpacePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
