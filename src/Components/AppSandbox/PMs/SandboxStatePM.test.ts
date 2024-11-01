import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppSandboxEntity, SandboxState } from "../Entities/AppSandboxEntity";
import { SandboxStatePM, makeSandboxStatePM } from "./SandboxStatePM";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Sandbox");
  const sandbox = makeAppSandboxEntity(ao);
  const pm = makeSandboxStatePM(ao);

  return {
    registerSingletonSpy,
    pm,
    sandbox,
    appObjects
  };
}

describe("Sandbox State PM", () => {
  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();

    expect(SandboxStatePM.get(appObjects)).toEqual(pm);
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
    sandbox.state = SandboxState.MOUNTED;

    expect(pm.lastVM).toEqual(SandboxState.MOUNTED);

    sandbox.state = SandboxState.LOADING;

    expect(pm.lastVM).toEqual(SandboxState.LOADING);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    expect(pm.vmsAreEqual(SandboxState.MOUNTED, SandboxState.MOUNTED)).toEqual(
      true
    );
    expect(pm.vmsAreEqual(SandboxState.MOUNTED, SandboxState.PLAYING)).toEqual(
      false
    );
  });
});
