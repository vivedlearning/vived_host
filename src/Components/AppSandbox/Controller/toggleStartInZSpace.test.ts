import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { toggleStartInZSpace } from "./toggleStartInZSpace";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const sandboxEntity = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  return { appObjects, sandboxEntity };
}

describe("Toggle Start in ZSpace Controller", () => {
  it("Toggles the flag", () => {
    const { appObjects, sandboxEntity } = makeTestRig();

    sandboxEntity.startInZSpace = true;

    toggleStartInZSpace(appObjects);

    expect(sandboxEntity.startInZSpace).toEqual(false);

    toggleStartInZSpace(appObjects);

    expect(sandboxEntity.startInZSpace).toEqual(true);
  });
});
