import { makeAppObjectRepo } from "@vived/core";
import { makeMockAssetPluginPM } from "../Mocks/MockAssetPluginPM";
import { defaultAssetPluginVM } from "../PM/AssetPluginPM";
import { assetPluginPMAdapter } from "./assetPluginPMAdapter";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeMockAssetPluginPM(appObjects);
  return { appObjects, mockPM };
}

describe("Selected Challenge Hook Adapter", () => {
  it("Sets the Default VM", () => {
    expect(assetPluginPMAdapter.defaultVM).toEqual(defaultAssetPluginVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    assetPluginPMAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    assetPluginPMAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
