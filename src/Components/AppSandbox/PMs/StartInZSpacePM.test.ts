import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { StartInZSpacePM, makeStartInZSpacePM } from "./StartInZSpacePM";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Sandbox");
  const sandbox = makeAppSandboxEntity(ao);
  const pm = makeStartInZSpacePM(ao);

  return {
    registerSingletonSpy,
    pm,
    sandbox,
    appObjects
  };
}

describe("Start in Inspector PM", () => {
  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();

    expect(StartInZSpacePM.get(appObjects)).toEqual(pm);
  });

  it("Registers as the singleton", () => {
    const { pm, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Initializes the VM", () => {
    const { pm } = makeTestRig();

    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Updates when the entity changes", () => {
    const { pm, sandbox } = makeTestRig();
    sandbox.startInZSpace = true;

    expect(pm.lastVM).toEqual(true);

    sandbox.startInZSpace = false;

    expect(pm.lastVM).toEqual(false);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    expect(pm.vmsAreEqual(true, true)).toEqual(true);
    expect(pm.vmsAreEqual(false, false)).toEqual(true);
    expect(pm.vmsAreEqual(true, false)).toEqual(false);
    expect(pm.vmsAreEqual(false, true)).toEqual(false);
  });
});
