import { makeAppObjectRepo } from "@vived/core";
import { makeAppSandboxEntity } from "../Entities/AppSandboxEntity";
import { ShowInspectorPM, makeShowInspectorPM } from "./ShowInspectorPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Sandbox");
  const sandbox = makeAppSandboxEntity(ao);
  const pm = makeShowInspectorPM(ao);

  return {
    registerSingletonSpy,
    pm,
    sandbox,
    appObjects
  };
}

describe("Show Inspector PM", () => {
  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();

    expect(ShowInspectorPM.get(appObjects)).toEqual(pm);
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
    sandbox.showBabylonInspector = true;

    expect(pm.lastVM).toEqual(true);

    sandbox.showBabylonInspector = false;

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
