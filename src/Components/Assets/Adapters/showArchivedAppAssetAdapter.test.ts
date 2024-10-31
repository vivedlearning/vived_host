import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeShowArchivedAppAssetPMMock } from "../Mocks/ShowArchivedAppAssetPMMock";
import { showArchivedAppAssetAdapter } from "./showArchivedAppAssetAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeShowArchivedAppAssetPMMock(appObjects);
  return { appObjects, mockPM };
}

describe("Show Archived App Assets Adapter", () => {
  it("Sets the Default VM", () => {
    expect(showArchivedAppAssetAdapter.defaultVM).toEqual(false);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    showArchivedAppAssetAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    showArchivedAppAssetAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
