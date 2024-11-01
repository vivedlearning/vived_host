import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { toggleAllowDevFeatures } from "./toggleAllowDevFeatures";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

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
