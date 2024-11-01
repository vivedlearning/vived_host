import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { EmulateZSpacePM } from "../PMs/EmulateZSpacePM";

export const emulateZSpaceAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: HostAppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = EmulateZSpacePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "emulateZSpaceAdapter",
        "Unable to find EmulateZSpacePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: boolean) => void
  ) => {
    const pm = EmulateZSpacePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "emulateZSpaceAdapter",
        "Unable to find EmulateZSpacePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
