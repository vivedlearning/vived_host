import { makeAppObjectRepo } from "@vived/core";
import { makeAppEntity } from "../Entities/AppEntity";
import { AppVM, makeAppPM } from "./AppPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const ao = appObjects.getOrCreate("app0");
  const app = makeAppEntity(ao);

  app.name = "An App Name";
  app.description = "An App Description";
  app.image_url = "www.image.url";

  const pm = makeAppPM(ao);
  return { app, pm, appObjects };
}

describe("Slide App List PM", () => {
  it("Initializes the view", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Checks for equal vms", () => {
    const { pm } = makeTestRig();

    const vm1: AppVM = {
      id: "id",
      name: "name",
      description: "description",
      imageURL: "www.image.url"
    };
    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for change in the name", () => {
    const { pm } = makeTestRig();

    const vm1: AppVM = {
      id: "id",
      name: "name",
      description: "description",
      imageURL: "www.image.url"
    };
    const vm2 = { ...vm1, name: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for change in the description", () => {
    const { pm } = makeTestRig();

    const vm1: AppVM = {
      id: "id",
      name: "name",
      description: "description",
      imageURL: "www.image.url"
    };
    const vm2 = { ...vm1, description: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for change in the imageURL", () => {
    const { pm } = makeTestRig();

    const vm1: AppVM = {
      id: "id",
      name: "name",
      description: "description",
      imageURL: "www.image.url"
    };
    const vm2 = { ...vm1, imageURL: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Set up the VM", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM?.id).toEqual("app0");
    expect(pm.lastVM?.name).toEqual("An App Name");
    expect(pm.lastVM?.description).toEqual("An App Description");
    expect(pm.lastVM?.imageURL).toEqual("www.image.url");
  });
});
