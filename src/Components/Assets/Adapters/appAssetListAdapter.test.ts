import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppAssetListPMMock } from "../Mocks/AppAssetListPMMock";
import { appAssetListAdapter } from "./appAssetListAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeAppAssetListPMMock(appObjects);
  return { appObjects, mockPM };
}

describe("App Asset List Adapter", () => {
  it("Sets the Default VM", () => {
    expect(appAssetListAdapter.defaultVM).toEqual([]);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    appAssetListAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    appAssetListAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
