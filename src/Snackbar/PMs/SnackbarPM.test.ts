import { makeAppObjectRepo } from "@vived/core";
import { makeSnackbarRepo } from "../Entities";
import { makeSnackbarPM, SnackbarPM, SnackbarVM } from "./SnackbarPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Snackbar");
  const snackbarRepo = makeSnackbarRepo(ao);
  const pm = makeSnackbarPM(ao);

  return { snackbarRepo, pm, appObjects, registerSingletonSpy };
}

describe("Snackbar Presentation Manager", () => {
  it("Gets the singleton", () => {
    const { appObjects, pm } = makeTestRig();
    expect(SnackbarPM.get(appObjects)).toEqual(pm);
  });

  it("Registers as singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();
    const vm1: SnackbarVM = {
      message: "test",
      durationInSeconds: 4,
      actionButtonText: "action"
    };
    const vm2: SnackbarVM = { ...vm1 };
    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Initializes with undefined message", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM?.message).toEqual(undefined);
  });

  it("Updates when snackbar is made", () => {
    const { pm, snackbarRepo } = makeTestRig();
    snackbarRepo.makeSnackbar("test");
    expect(pm.lastVM?.message).toEqual("test");
  });

  it("Updates appropriately when action is set", () => {
    const { pm, snackbarRepo } = makeTestRig();
    snackbarRepo.makeSnackbar("test", {
      actionButtonText: "action",
      action: () => {}
    });
    expect(pm.lastVM?.actionButtonText).toEqual("action");
  });

  it("Updates appropriately when duration is set", () => {
    const { pm, snackbarRepo } = makeTestRig();
    snackbarRepo.makeSnackbar("test", undefined, 5);
    expect(pm.lastVM?.durationInSeconds).toEqual(5);
  });

  it("Updates appropriately when snackbar is dismissed", () => {
    const { pm, snackbarRepo } = makeTestRig();
    snackbarRepo.makeSnackbar("test");
    snackbarRepo.dismissActiveSnackbar();
    expect(pm.lastVM?.message).toEqual(undefined);
  });
});
