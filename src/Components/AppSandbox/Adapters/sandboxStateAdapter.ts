import { HostAppObjectRepo } from "../../../HostAppObject/HostAppObjectRepo";
import { SingletonPmAdapter } from "../../../Types/SingletonPmAdapter";
import { SandboxState } from "../Entities/AppSandboxEntity";
import { SandboxStatePM } from "../PMs/SandboxStatePM";

export const sandboxStateAdapter: SingletonPmAdapter<SandboxState> = {
  defaultVM: SandboxState.UNMOUNTED,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: SandboxState) => void
  ) => {
    const pm = SandboxStatePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "renderAppAdapter",
        "Unable to find SandboxStatePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: SandboxState) => void
  ) => {
    const pm = SandboxStatePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "renderAppAdapter",
        "Unable to find SandboxStatePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
