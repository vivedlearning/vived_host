import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import {
  ChallengeResultsListPM,
  ChallengeResultVM
} from "../PMs/ChallengeResultsListPM";

export const challengeResultsListAdapter: SingletonPmAdapter<
  ChallengeResultVM[]
> = {
  defaultVM: [],
  subscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: ChallengeResultVM[]) => void
  ) => {
    const pm = ChallengeResultsListPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "challengeResultsListAdapter",
        "Unable to find ChallengeResultsListPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: ChallengeResultVM[]) => void
  ) => {
    const pm = ChallengeResultsListPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "challengeResultsListAdapter",
        "Unable to find ChallengeResultsListPM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
