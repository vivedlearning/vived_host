import { AppObject, AppObjectRepo } from "@vived/core";
import { HasChallengeResultsPM } from "../PMs/HasChallengeResultsPM";

export class MockHasChallengeResultsPM extends HasChallengeResultsPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, HasChallengeResultsPM.type);
  }
}

export function makeMockHasChallengeResultsPM(appObjects: AppObjectRepo) {
  return new MockHasChallengeResultsPM(
    appObjects.getOrCreate("MockHasChallengeResultsPM")
  );
}
