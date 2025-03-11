import { makeAppObjectRepo } from "@vived/core";
import { makeCancelEditingUCMock } from "../../Mocks/CancelEditingUCMock";
import { CancelEditingUC } from "./CancelEditingUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeCancelEditingUCMock(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("Cancel Editing UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(CancelEditingUC.get(appObjects)).toEqual(uc);
  });
});
