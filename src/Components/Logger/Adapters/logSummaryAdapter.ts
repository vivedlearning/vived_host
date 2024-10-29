import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { LogSummaryPM, LogSummaryVM, defaultVM } from "../PMs/LogSummaryPM";

export const logSummaryAdapter: SingletonPmAdapter<LogSummaryVM> = {
  defaultVM: defaultVM,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: LogSummaryVM) => void
  ) => {
    const pm = LogSummaryPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "logSummaryAdapter",
        "Unable to find LogSummaryPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: LogSummaryVM) => void
  ) => {
    const pm = LogSummaryPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "logSummaryAdapter",
        "Unable to find LogSummaryPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
