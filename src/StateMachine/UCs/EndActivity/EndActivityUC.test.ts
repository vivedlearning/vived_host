import { makeAppObjectRepo } from "@vived/core";
import { makeEndActivityUCMock } from "../../Mocks/EndActivityUCMock";
import { EndActivityUC } from "./EndActivityUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeEndActivityUCMock(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("Edit Active State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(EndActivityUC.get(appObjects)).toEqual(uc);
  });
});
