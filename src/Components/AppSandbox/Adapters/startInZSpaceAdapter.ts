import { HostAppObjectRepo } from "../../../HostAppObject/HostAppObjectRepo";
import { SingletonPmAdapter } from "../../../Types/SingletonPmAdapter";
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
