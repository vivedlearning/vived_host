import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeCancelEditingUCMock } from "../../Mocks";
import { CancelEditingUC } from "./CancelEditingUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
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
