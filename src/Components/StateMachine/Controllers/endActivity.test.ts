import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeEndActivityUCMock } from "../Mocks/EndActivityUCMock";
import { endActivity } from "./endActivity";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const uc = makeEndActivityUCMock(appObjects);

  return { uc, appObjects };
}

describe("End Activity Controller", () => {
  it("Calls the UC", () => {
    const { uc, appObjects } = makeTestRig();

    endActivity(appObjects);

    expect(uc.end).toBeCalled();
  });

  it("Warns if it cannot find the UC", () => {
    const { uc, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    uc.dispose();

    endActivity(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
