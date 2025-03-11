import { makeAppObjectRepo } from "@vived/core";
import { makeMockEditActiveStateUC } from "../Mocks/MockEditActiveStateUC";
import { editActiveState } from "./editActiveState";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeMockEditActiveStateUC(appObjects);

  return { uc, appObjects };
}

describe("Edit Active State Controller", () => {
  it("Calls the UC", () => {
    const { uc, appObjects } = makeTestRig();

    editActiveState(appObjects);

    expect(uc.editActiveState).toBeCalled();
  });

  it("Warns if it cannot find the UC", () => {
    const { uc, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    uc.dispose();

    editActiveState(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
