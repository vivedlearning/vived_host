import { makeAppObjectRepo } from "@vived/core";
import { makeEditStateUCMock } from "../../Mocks/EditStateUCMock";
import { EditStateUC } from "./EditStateUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeEditStateUCMock(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("Edit State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(EditStateUC.get(appObjects)).toEqual(uc);
  });
});
