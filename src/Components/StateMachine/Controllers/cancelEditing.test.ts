import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeCancelEditingUCMock } from "../Mocks/CancelEditingUCMock";
import { cancelEditing } from "./cancelEditing";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const uc = makeCancelEditingUCMock(appObjects);

  return { uc, appObjects };
}

describe("Cancel Editing Controller", () => {
  it("Calls the UC", () => {
    const { uc, appObjects } = makeTestRig();

    cancelEditing(appObjects);

    expect(uc.cancel).toBeCalled();
  });

  it("Warns if it cannot find the UC", () => {
    const { uc, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    uc.dispose();

    cancelEditing(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
