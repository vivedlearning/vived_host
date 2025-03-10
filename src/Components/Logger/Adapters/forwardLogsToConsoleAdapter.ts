import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { ForwardLogsToConsolePM } from "../PMs/ForwardLogsToConsolePM";

export const forwardLogsToConsoleAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
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
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
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
