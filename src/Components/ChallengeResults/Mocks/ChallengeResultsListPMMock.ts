import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ChallengeResultsListPM } from "../PMs/ChallengeResultsListPM";

export class ChallengeResultsListPMMock extends ChallengeResultsListPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, ChallengeResultsListPM.type);
  }
}

export function makeChallengeResultsListPMMock(appObjects: HostAppObjectRepo) {
  return new ChallengeResultsListPMMock(
    appObjects.getOrCreate("ChallengeResultsListPMMock")
  );
}
