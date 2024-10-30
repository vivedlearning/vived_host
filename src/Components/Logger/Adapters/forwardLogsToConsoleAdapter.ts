import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { ForwardLogsToConsolePM } from "../PMs/ForwardLogsToConsolePM";

export const forwardLogsToConsoleAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: HostAppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = ForwardLogsToConsolePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "forwardLogsToConsoleAdapter",
        "Unable to find ForwardLogsToConsolePM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: boolean) => void
  ) => {
    const pm = ForwardLogsToConsolePM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "forwardLogsToConsoleAdapter",
        "Unable to find ForwardLogsToConsolePM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
