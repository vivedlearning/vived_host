import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import {
  LogSummaryPM,
  LogSummaryVM,
  defaultLogSummaryVM
} from "../PMs/LogSummaryPM";

export const logSummaryAdapter: SingletonPmAdapter<LogSummaryVM> = {
  defaultVM: defaultLogSummaryVM,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: LogSummaryVM) => void) => {
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
    appObjects: AppObjectRepo,
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
