import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockTransitionToStateUC } from "../Mocks/MockTransitionToStateUC";
import { transitionToState } from "./transitionToState";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const uc = makeMockTransitionToStateUC(appObjects);

  return { uc, appObjects };
}

describe("Transition to state Controller", () => {
  it("Calls the UC", () => {
    const { uc, appObjects } = makeTestRig();

    transitionToState("state1", appObjects);

    expect(uc.transitionToState).toBeCalledWith("state1");
  });

  it("Warns if it cannot find the UC", () => {
    const { uc, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    uc.dispose();

    transitionToState("state1", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
