import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { clearSandboxAppContainer } from "./clearSandboxAppContainer";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const sandboxEntity = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  return { appObjects, sandboxEntity };
}

describe("Clear App Container Controller", () => {
  it("Clears the container", () => {
    const { appObjects, sandboxEntity } = makeTestRig();

    sandboxEntity.appContainer = document.createElement("div");

    clearSandboxAppContainer(appObjects);

    expect(sandboxEntity.appContainer).toBeUndefined();
  });
});
