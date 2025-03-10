import { makeAppObjectRepo } from "@vived/core";
import { MockAppMounterUC } from "../../Apps";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { mountSandboxApp } from "./mountSandboxApp";

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

    mountSandboxApp(appObjects);

    expect(mockMounter.mountLatestVersion).toBeCalled();
  });

  it("Warns if it cannot find the component", () => {
    const { appObjects, mockMounter } = makeTestRig();
    appObjects.submitWarning = jest.fn();
    mockMounter.dispose();

    mountSandboxApp(appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });
});
