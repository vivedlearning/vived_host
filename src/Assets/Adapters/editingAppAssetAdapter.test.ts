import { makeAppObjectRepo } from "@vived/core";
import { makeEditingAppAssetPMMock } from "../Mocks/EditingAppAssetPMMock";
import { editingAppAssetAdapter } from "./editingAppAssetAdapter";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeEditingAppAssetPMMock(appObjects);
  return { appObjects, mockPM };
}

describe("Editing App Asset Adapter", () => {
  it("Sets the Default VM", () => {
    expect(editingAppAssetAdapter.defaultVM).toBeUndefined();
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    editingAppAssetAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    editingAppAssetAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
