import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeZSpaceHostEntity } from "../Entities/ZSpaceHost";
import { EmulateZSpacePM } from "./EmulateZSpacePM";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const zSpace = makeZSpaceHostEntity(appObjects.getOrCreate("zSpace"));

  const pm = new EmulateZSpacePM(appObjects.getOrCreate("zSpace"));

  return { pm, zSpace, registerSingletonSpy, appObjects };
}

describe("Emulate zSpace PM", () => {
  test("Initializes the VM", () => {
    const { pm, zSpace } = makeTestRig();

    expect(pm.lastVM).toEqual(zSpace.emulate);
  });

  it("Updates when the entity updates", () => {
    const { pm, zSpace } = makeTestRig();

    zSpace.emulate = false;
    expect(pm.lastVM).toEqual(false);

    zSpace.emulate = true;
    expect(pm.lastVM).toEqual(true);
  });

  it("Checks for a change in the VM", () => {
    const { pm } = makeTestRig();

    expect(pm.vmsAreEqual(true, true)).toEqual(true);
    expect(pm.vmsAreEqual(false, false)).toEqual(true);

    expect(pm.vmsAreEqual(true, false)).toEqual(false);
    expect(pm.vmsAreEqual(false, true)).toEqual(false);
  });

  it("Registers as the singleton", () => {
    const { pm, registerSingletonSpy } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();
    expect(EmulateZSpacePM.get(appObjects)).toEqual(pm);
  });
});
