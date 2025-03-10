import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { ShowInspectorPM } from "../PMs/ShowInspectorPM";

export const showInspectorAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
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
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
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
