import { makeAppObjectRepo } from "@vived/core";
import { makeMockSaveAuthoringUC } from "../Mocks/MockSaveAuthoringUC";
import { saveAuthoring } from "./saveAuthoring";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeMockSaveAuthoringUC(appObjects);

  return { uc, appObjects };
}

describe("Save Authoring Controller", () => {
  it("Calls the UC", () => {
    const { uc, appObjects } = makeTestRig();

    saveAuthoring(appObjects);

    expect(uc.saveAuthoring).toBeCalled();
  });

  it("Warns if it cannot find the UC", () => {
    const { uc, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    uc.dispose();

    saveAuthoring(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
