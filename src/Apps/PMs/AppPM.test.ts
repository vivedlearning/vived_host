import { makeAppObjectRepo } from "@vived/core";
import { makeAppEntity } from "../Entities/AppEntity";
import { AppVM, makeAppPM } from "./AppPM";
import { makeAssetEntity } from "../../Assets/Entities/AssetEntity";

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
      imageURL: "www.image.url",
      isFetching: false
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
      imageURL: "www.image.url",
      isFetching: false
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
      imageURL: "www.image.url",
      isFetching: false
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
      imageURL: "www.image.url",
      isFetching: false
    };
    const vm2 = { ...vm1, imageURL: "CHANGED" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for change in the isFetching", () => {
    const { pm } = makeTestRig();

    const vm1: AppVM = {
      id: "id",
      name: "name",
      description: "description",
      imageURL: "www.image.url",
      isFetching: false
    };
    const vm2 = { ...vm1, isFetching: true };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Set up the VM", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM?.id).toEqual("app0");
    expect(pm.lastVM?.name).toEqual("An App Name");
    expect(pm.lastVM?.description).toEqual("An App Description");
    expect(pm.lastVM?.imageURL).toEqual("www.image.url");
    expect(pm.lastVM?.isFetching).toEqual(false);
  });

  it("Uses asset blob URL when imageAssetId is present", () => {
    const { app, appObjects } = makeTestRig();

    // Create a test asset
    const assetAO = appObjects.getOrCreate("asset123");
    const asset = makeAssetEntity(assetAO);

    // Set up app to reference the asset
    app.imageAssetId = "asset123";

    // Set a mock blob URL directly instead of using File and URL.createObjectURL
    Object.defineProperty(asset, "blobURL", {
      get: () => "mock://blob-url"
    });

    // Create a new PM after setting up the asset relationship
    const pm = makeAppPM(app.appObject);

    // Verify it uses the asset's blob URL instead of image_url
    expect(pm.lastVM?.imageURL).toEqual("mock://blob-url");
    expect(pm.lastVM?.isFetching).toEqual(false);
  });

  it("Sets isFetching true when image asset is being fetched", () => {
    const { app, appObjects } = makeTestRig();

    // Create a test asset
    const assetAO = appObjects.getOrCreate("asset123");
    const asset = makeAssetEntity(assetAO);

    // Set up app to reference the asset
    app.imageAssetId = "asset123";

    // Set the asset to be in fetching state
    asset.isFetchingFile = true;

    // Create a new PM after setting up the asset relationship
    const pm = makeAppPM(app.appObject);

    // Verify it sets isFetching to true
    expect(pm.lastVM?.isFetching).toEqual(true);
    // Should still use the default image_url when fetching
    expect(pm.lastVM?.imageURL).toEqual(app.image_url);
  });

  it("Returns empty imageURL when asset has fetch error", () => {
    const { app, appObjects } = makeTestRig();

    // Create a test asset
    const assetAO = appObjects.getOrCreate("asset123");
    const asset = makeAssetEntity(assetAO);

    // Set up app to reference the asset
    app.imageAssetId = "asset123";

    // Set a fetch error on the asset
    asset.fetchError = new Error("Failed to fetch");

    // Create a new PM after setting up the asset relationship
    const pm = makeAppPM(app.appObject);

    // Verify it returns empty string for imageURL on error
    expect(pm.lastVM?.imageURL).toEqual("");
    expect(pm.lastVM?.isFetching).toEqual(false);
  });
});
