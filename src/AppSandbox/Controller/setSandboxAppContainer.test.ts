import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { setSandboxAppContainer } from "./setSandboxAppContainer";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const sandboxEntity = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  return { appObjects, sandboxEntity };
}

describe("Sets App Container Controller", () => {
  it("Sets the container", () => {
    const { appObjects, sandboxEntity } = makeTestRig();

    sandboxEntity.appContainer = undefined;

    const container = document.createElement("div");

    setSandboxAppContainer(container, appObjects);

    expect(sandboxEntity.appContainer).toEqual(container);
  });
});
