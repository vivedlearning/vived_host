import { makeAppObjectRepo } from "@vived/core";
import { makeSavePersistentStatesMock } from "../Mocks/SavePersistentStatesMock";
import { savePersistentStates } from "./savePersistentStates";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockUC = makeSavePersistentStatesMock(appObjects);

  return { appObjects, mockUC };
}

describe("Duplicate State Controller", () => {
  it("Toggles the value on the entity", () => {
    const { mockUC, appObjects } = makeTestRig();

    savePersistentStates(appObjects);

    expect(mockUC.saveLocally).toBeCalled();
  });

  it("Warns if it cannot find the entity", () => {
    const { mockUC, appObjects } = makeTestRig();

    mockUC.dispose();
    appObjects.submitWarning = jest.fn();

    savePersistentStates(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
