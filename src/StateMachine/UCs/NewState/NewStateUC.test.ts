import { makeAppObjectRepo } from "@vived/core";
import { makeNewStateUCMock } from "../../Mocks/NewStateUCMock";
import { NewStateUC } from "./NewStateUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeNewStateUCMock(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("New State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(NewStateUC.get(appObjects)).toEqual(uc);
  });
});
