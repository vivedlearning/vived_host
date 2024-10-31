import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import {ShowArchivedAppAssetPM} from "../PMs/ShowArchivedAppAssetPM";

export const showArchivedAppAssetAdapter: SingletonPmAdapter<
  boolean
> = {
  defaultVM: false,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: boolean) => void
  ) => {
    const pm = ShowArchivedAppAssetPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "showArchivedAppAssetAdapter",
        "Unable to find ShowArchivedAppAssetPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: boolean) => void
  ) => {
    const pm = ShowArchivedAppAssetPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "showArchivedAppAssetAdapter",
        "Unable to find ShowArchivedAppAssetPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
