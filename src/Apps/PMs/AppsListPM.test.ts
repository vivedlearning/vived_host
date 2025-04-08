import { makeAppObjectRepo } from "@vived/core";
import { makeAppRepo } from "../Entities/AppRepo";
import { AppsListPM, makeAppsListPM } from "./AppsListPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const ao = appObjects.getOrCreate("Apps");
  const slideAppRepo = makeAppRepo(ao);

  const app = slideAppRepo.createApp("app0");
  app!.assignedToOwner = true;

  const pm = makeAppsListPM(ao);
  return { slideAppRepo, pm, appObjects, registerSingletonSpy };
}

describe("Slide App List PM", () => {
  it("Initializes the view", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();

    expect(AppsListPM.get(appObjects)).toEqual(pm);
  });

  it("Registers as the singleton", () => {
    const { pm, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Checks for equal vms", () => {
    const { pm } = makeTestRig();

    const vm1 = ["app1", "app2"];
    const vm2 = [...vm1];

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a app to be removed", () => {
    const { pm } = makeTestRig();

    const vm1 = ["app1", "app2"];
    const vm2 = ["app1"];

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a app to be added", () => {
    const { pm } = makeTestRig();

    const vm1 = ["app1", "app2"];
    const vm2 = ["app1", "app2", "app3"];

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a app to be changed", () => {
    const { pm } = makeTestRig();

    const vm1 = ["app1", "app2"];
    const vm2 = ["app1", "changed"];

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Forms the VM as expected", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).toEqual(["app0"]);
  });

  it("Updates the VM when the app list changes", () => {
    const { pm, slideAppRepo } = makeTestRig();

    const app = slideAppRepo.createApp("app2");
    app.assignedToOwner = true;
    expect(pm.lastVM).toEqual(["app0", "app2"]);
  });

  it("Limits the list to the apps that belong to the owner", () => {
    const { pm, slideAppRepo } = makeTestRig();

    const app = slideAppRepo.createApp("app2");
    app.assignedToOwner = false;
    expect(pm.lastVM).toEqual(["app0"]);
  });
});
