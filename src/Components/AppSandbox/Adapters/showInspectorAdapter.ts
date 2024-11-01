import { HostAppObjectRepo } from "../../../HostAppObject/HostAppObjectRepo";
import { SingletonPmAdapter } from "../../../Types/SingletonPmAdapter";
import { ShowInspectorPM } from "../PMs/ShowInspectorPM";

export const showInspectorAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: HostAppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = ShowInspectorPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "showInspectorAdapter",
        "Unable to find ShowInspectorPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: boolean) => void
  ) => {
    const pm = ShowInspectorPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "showInspectorAdapter",
        "Unable to find ShowInspectorPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
