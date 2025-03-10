import { makeAppObjectRepo } from "@vived/core";
import { MockAppMounterUC } from "../../Apps/Mocks/MockAppMounterUC";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { unmountSandboxApp } from "./unmountSandboxApp";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const ao = appObjects.getOrCreate("AppID");
  const sandbox = makeAppSandboxEntity(ao);

  const mockMounter = new MockAppMounterUC(ao);

  return { sandbox, appObjects, ao, mockMounter };
}

describe("Mount Sandbox App Controller", () => {
  it("Sends the container to the UC", () => {
    const { appObjects, mockMounter } = makeTestRig();

    unmountSandboxApp(appObjects);

    expect(mockMounter.unmount).toBeCalled();
  });

  it("Warns if it cannot find the component", () => {
    const { appObjects, mockMounter } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    mockMounter.dispose();

    unmountSandboxApp(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
