import { AppObject, AppObjectRepo } from "@vived/core";
import { ChallengeResultsListPM } from "../PMs/ChallengeResultsListPM";

export class ChallengeResultsListPMMock extends ChallengeResultsListPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, ChallengeResultsListPM.type);
  }
}

export function makeChallengeResultsListPMMock(appObjects: AppObjectRepo) {
  return new ChallengeResultsListPMMock(
    appObjects.getOrCreate("ChallengeResultsListPMMock")
  );
}
