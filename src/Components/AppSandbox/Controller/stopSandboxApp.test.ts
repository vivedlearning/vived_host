import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { StopAppUC } from "../../Apps";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { stopSandboxApp } from "./stopSandboxApp";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const ao = appObjects.getOrCreate("AppID");

  const sandbox = makeAppSandboxEntity(ao);
  const mockStopper = jest.fn();
  StopAppUC.stopByID = mockStopper;

  return { sandbox, appObjects, ao, mockStopper };
}

describe("Start Sandbox App Controller", () => {
  it("Calls the stopper to the UC", () => {
    const { appObjects, mockStopper } = makeTestRig();

    stopSandboxApp(appObjects);

    expect(mockStopper).toBeCalledWith("AppID", appObjects);
  });
});
