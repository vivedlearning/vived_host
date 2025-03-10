import { makeAppObjectRepo } from "@vived/core";
import { AssetPMMock } from "../Mocks/AssetPMMock";
import { defaultAssetVM } from "../PMs/AssetPM";
import { assetAdapter } from "./assetAdapter";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("app1");

  const mockPM = new AssetPMMock(ao);
  return { appObjects, mockPM };
}

describe("Asset Adapter", () => {
  it("Sets the Default VM", () => {
    expect(assetAdapter.defaultVM).toEqual(defaultAssetVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    assetAdapter.subscribe("app1", appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    assetAdapter.unsubscribe("app1", appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
