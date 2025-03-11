import { makeAppObjectRepo } from "@vived/core";
import { makeMockDeleteStateUC } from "../Mocks/MockDeleteStateUC";
import { deleteState } from "./deleteState";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockUC = makeMockDeleteStateUC(appObjects);

  return { appObjects, mockUC };
}

describe("Duplicate State Controller", () => {
  it("Toggles the value on the entity", () => {
    const { mockUC, appObjects } = makeTestRig();

    deleteState("slideID", appObjects);

    expect(mockUC.deleteState).toBeCalledWith("slideID");
  });

  it("Warns if it cannot find the entity", () => {
    const { mockUC, appObjects } = makeTestRig();

    mockUC.dispose();
    appObjects.submitWarning = jest.fn();

    deleteState("slideID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
