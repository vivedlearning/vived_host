import { makeAppObjectRepo } from "@vived/core";
import { makeNewStateUCMock } from "../Mocks/NewStateUCMock";
import { newState } from "./newState";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeNewStateUCMock(appObjects);

  return { uc, appObjects };
}

describe("New State Controller", () => {
  it("Calls the UC", () => {
    const { uc, appObjects } = makeTestRig();

    newState(appObjects);

    expect(uc.createState).toBeCalled();
  });

  it("Warns if it cannot find the UC", () => {
    const { uc, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    uc.dispose();

    newState(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
