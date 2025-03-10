import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { clearSandboxAppContainer } from "./clearSandboxAppContainer";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

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
