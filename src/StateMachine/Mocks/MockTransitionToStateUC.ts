import { AppObject, AppObjectRepo } from "@vived/core";
import { TransitionToStateUC } from "../UCs/TransitionToState/TransitionToStateUC";

export class MockTransitionToStateUC extends TransitionToStateUC {
  transitionToState = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, TransitionToStateUC.type);
  }
}

export function makeMockTransitionToStateUC(appObjects: AppObjectRepo) {
  return new MockTransitionToStateUC(
    appObjects.getOrCreate("MockTransitionToStateUC")
  );
}
