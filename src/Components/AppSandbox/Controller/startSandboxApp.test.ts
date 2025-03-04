import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockStartAppUC } from "../../Apps";
import { StartAppUC } from "../../Apps/UCs/StartAppUC";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { startSandboxApp } from "./startSandboxApp";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const ao = appObjects.getOrCreate("AppID");

  const sandbox = makeAppSandboxEntity(ao);

  new MockStartAppUC(ao);

  const mockStarter = jest.fn();
  StartAppUC.startByID = mockStarter;

  return { sandbox, appObjects, ao, mockStarter };
}

describe("Start App Controller", () => {
  it("Sends the container to the UC", () => {
    const { appObjects, mockStarter } = makeTestRig();
    const container = document.createElement("div");

    startSandboxApp(container, appObjects);

    expect(mockStarter).toBeCalledWith(container, "AppID", appObjects);
  });
});
