import { makeAppObjectRepo } from "@vived/core";
import { makeMockSaveAuthoringUC } from "../../Mocks/MockSaveAuthoringUC";
import { SaveAuthoringUC } from "./SaveAuthoringUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeMockSaveAuthoringUC(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("Edit Active State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(SaveAuthoringUC.get(appObjects)).toEqual(uc);
  });
});
