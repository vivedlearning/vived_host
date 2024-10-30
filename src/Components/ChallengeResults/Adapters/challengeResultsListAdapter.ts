import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { ChallengeResultsListPM, ChallengeResultVM } from "../PMs/ChallengeResultsListPM";

export const challengeResultsListAdapter: SingletonPmAdapter<
  ChallengeResultVM[]
> = {
  defaultVM: [],
  subscribe: (
    appObjects: HostAppObjectRepo,
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
    appObjects: HostAppObjectRepo,
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
