import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeConsumeStateUCMock } from "../Mocks/ConsumeStateUCMock";
import { consumeState } from "./consumeState";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const uc = makeConsumeStateUCMock(appObjects);

  return { uc, appObjects };
}

describe("Consume State Controller", () => {
  it("Calls the UC", () => {
    const { uc, appObjects } = makeTestRig();

    consumeState("state1", appObjects);

    expect(uc.consume).toBeCalledWith("state1");
  });

  it("Warns if it cannot find the UC", () => {
    const { uc, appObjects } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    uc.dispose();

    consumeState("state1", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
