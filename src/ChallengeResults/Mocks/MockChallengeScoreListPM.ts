import { AppObject, AppObjectRepo } from "@vived/core";
import {
  ChallengeScoreListPM,
  SlideScoreVM
} from "../PMs/ChallengeScoreListPM";

export class MockChallengeScoreListPM extends ChallengeScoreListPM {
  vmsAreEqual = jest
    .fn()
    .mockImplementation(
      (a: SlideScoreVM[], b: SlideScoreVM[]): boolean => true
    );

  constructor(appObject: AppObject) {
    super(appObject, ChallengeScoreListPM.type);
    this.appObjects.registerSingleton(this);
  }
}

export function makeMockChallengeScoreListPM(
  appObjects: AppObjectRepo
): MockChallengeScoreListPM {
  return new MockChallengeScoreListPM(
    appObjects.getOrCreate("MockChallengeScoreListPM")
  );
}
