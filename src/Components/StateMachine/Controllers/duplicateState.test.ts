import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockDuplicateStateUC } from "../Mocks";
import { duplicateState } from "./duplicateState";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockUC = makeMockDuplicateStateUC(appObjects);

  return { appObjects, mockUC };
}

describe("Duplicate State Controller", () => {
  it("Toggles the value on the entity", () => {
    const { mockUC, appObjects } = makeTestRig();

    duplicateState("slideID", appObjects);

    expect(mockUC.duplicateState).toBeCalledWith("slideID");
  });

  it("Warns if it cannot find the entity", () => {
    const { mockUC, appObjects } = makeTestRig();

    mockUC.dispose();
    appObjects.submitWarning = jest.fn();

    duplicateState("slideID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
