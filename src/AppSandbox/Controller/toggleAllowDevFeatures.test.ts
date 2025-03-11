import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { toggleAllowDevFeatures } from "./toggleAllowDevFeatures";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const sandboxEntity = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  return { appObjects, sandboxEntity };
}

describe("Toggle Allow Dev Features", () => {
  it("Toggles the flag", () => {
    const { appObjects, sandboxEntity } = makeTestRig();

    sandboxEntity.enableDevFeatures = true;

    toggleAllowDevFeatures(appObjects);

    expect(sandboxEntity.enableDevFeatures).toEqual(false);

    toggleAllowDevFeatures(appObjects);

    expect(sandboxEntity.enableDevFeatures).toEqual(true);
  });
});
