import { makeAppObjectRepo } from "@vived/core";
import {
  makeAppSandboxEntity,
  SandboxState
} from "../Entities/AppSandboxEntity";
import { setSandboxAppState } from "./setSandboxAppState";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const sandboxEntity = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  return { appObjects, sandboxEntity };
}

describe("Sets App State Controller", () => {
  it("Sets the container", () => {
    const { appObjects, sandboxEntity } = makeTestRig();

    sandboxEntity.state = SandboxState.EDIT_ASSET;

    setSandboxAppState(SandboxState.PLAYING, appObjects);

    expect(sandboxEntity.state).toEqual(SandboxState.PLAYING);
  });
});
