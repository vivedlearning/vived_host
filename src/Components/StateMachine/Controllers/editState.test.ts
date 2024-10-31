import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeEditStateUCMock } from "../Mocks/EditStateUCMock";
import { editState } from "./editState";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const uc = makeEditStateUCMock(appObjects);

  return { uc, appObjects };
}

describe("Edit State Controller", () => {
  it("Calls the UC", () => {
    const { uc, appObjects } = makeTestRig();

    editState("state1", appObjects);

    expect(uc.edit).toBeCalledWith("state1");
  });

  it("Warns if it cannot find the UC", () => {
    const { uc, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    uc.dispose();

    editState("state1", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
