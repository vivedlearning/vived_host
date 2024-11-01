import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeMockTransitionToStateUC } from "../../Mocks/MockTransitionToStateUC";
import { TransitionToStateUC } from "./TransitionToStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const uc = makeMockTransitionToStateUC(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("Transition to State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(TransitionToStateUC.get(appObjects)).toEqual(uc);
  });
});
