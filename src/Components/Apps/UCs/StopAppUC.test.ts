import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeStopAppUC, StopAppUC } from "./StopAppUC";
import { MockDispatchStopAppUC } from "../../Dispatcher";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const ao = appObjects.getOrCreate("App1");
  const uc = makeStopAppUC(ao);
  const mockStopApp = new MockDispatchStopAppUC(ao);

  return {
    uc,
    ao,
    appObjects,
    mockStopApp
  };
}

describe("Stop App UC", () => {
  it("Gets an app object", () => {
    const { ao, uc } = makeTestRig();

    expect(StopAppUC.get(ao)).toEqual(uc);
  });

  it("Gets by ID", () => {
    const { uc, appObjects } = makeTestRig();

    expect(StopAppUC.getByID("App1", appObjects)).toEqual(uc);
  });

  it("Stops by ID", () => {
    const { uc, appObjects } = makeTestRig();

    uc.stop = jest.fn();

    StopAppUC.stopByID("App1", appObjects);
    expect(uc.stop).toBeCalledWith();
  });

  it("Stops the app", () => {
    const { uc, mockStopApp } = makeTestRig();

    uc.stop();

    expect(mockStopApp.doDispatch).toBeCalled();
  });
});
