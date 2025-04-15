import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import {
  ChallengeScoreListPM,
  SlideScoreVM
} from "../PMs/ChallengeScoreListPM";

export const challengeScoreListAdapter: SingletonPmAdapter<SlideScoreVM[]> = {
  defaultVM: [],
  subscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: SlideScoreVM[]) => void
  ) => {
    const pm = ChallengeScoreListPM.get(appObjects);
    if (!pm) {
      appObjects.submitError(
        "challengeScoreListAdapter",
        "Unable to find ChallengeScoreListPM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: AppObjectRepo,
    setVM: (vm: SlideScoreVM[]) => void
  ) => {
    ChallengeScoreListPM.get(appObjects)?.removeView(setVM);
  }
};
