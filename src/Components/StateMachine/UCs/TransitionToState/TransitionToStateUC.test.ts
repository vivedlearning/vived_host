import { makeAppObjectRepo } from "@vived/core";
import { makeMockTransitionToStateUC } from "../../Mocks/MockTransitionToStateUC";
import { TransitionToStateUC } from "./TransitionToStateUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
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
