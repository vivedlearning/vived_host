// filepath: c:\Users\amosp\Documents\WebGL\vivedlearning_host\src\Assets\Adapters\assetFileAdapter.test.ts
import { makeAppObjectRepo } from "@vived/core";
import { AssetFilePMMock } from "../Mocks/AssetFilePMMock";
import { defaultAssetFileVM } from "../PMs/AssetFilePM";
import { assetFileAdapter } from "./assetFileAdapter";

/**
 * Creates the test environment for the assetFileAdapter tests
 * @returns Testing objects including mocked PM and appObjects
 */
function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("asset1");

  const mockPM = new AssetFilePMMock(ao);
  return { appObjects, mockPM };
}

describe("AssetFile Adapter", () => {
  it("Sets the Default VM", () => {
    expect(assetFileAdapter.defaultVM).toEqual(defaultAssetFileVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    assetFileAdapter.subscribe("asset1", appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    assetFileAdapter.unsubscribe("asset1", appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
