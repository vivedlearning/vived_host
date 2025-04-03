import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { HasChallengeResultsPM } from "../PMs/HasChallengeResultsPM";

export const hasChallengeResultsPMAdapter: SingletonPmAdapter<boolean> = {
  defaultVM: false,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = HasChallengeResultsPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "hasChallengeResultsPMAdapter",
        "Unable to find HasChallengeResultsPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: boolean) => void) => {
    const pm = HasChallengeResultsPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "hasChallengeResultsPMAdapter",
        "Unable to find HasChallengeResultsPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
