import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { TransitionToStateUC } from "../UCs/TransitionToStateUC";

export class MockTransitionToStateUC extends TransitionToStateUC {
  transitionToState = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, TransitionToStateUC.type);
  }
}

export function makeMockTransitionToStateUC(appObjects: HostAppObjectRepo) {
  return new MockTransitionToStateUC(
    appObjects.getOrCreate("MockTransitionToStateUC")
  );
}
