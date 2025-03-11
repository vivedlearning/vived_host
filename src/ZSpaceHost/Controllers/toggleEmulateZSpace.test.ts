import { makeAppObjectRepo } from "@vived/core";
import { makeZSpaceHostEntity } from "../Entities";
import { toggleEmulateZSpace } from "./toggleEmulateZSpace";
function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const zSpace = makeZSpaceHostEntity(appObjects.getOrCreate("zspace"));

  return { appObjects, zSpace };
}

describe("Toggle Emulate zSpace controller", () => {
  it("Toggles the flag", () => {
    const { appObjects, zSpace } = makeTestRig();

    zSpace.emulate = true;

    toggleEmulateZSpace(appObjects);

    expect(zSpace.emulate).toEqual(false);

    toggleEmulateZSpace(appObjects);

    expect(zSpace.emulate).toEqual(true);
  });
});
