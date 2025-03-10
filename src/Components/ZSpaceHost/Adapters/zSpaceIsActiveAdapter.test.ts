import { makeAppObjectRepo } from "@vived/core";
import { makeZSpaceIsActivePMMock } from "../Mocks/ZSpaceIsActivePMMock";
import { zSpaceIsActiveAdapter } from "./zSpaceIsActiveAdapter";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeZSpaceIsActivePMMock(appObjects);
  return { appObjects, mockPM };
}

describe("ZSpace Is Active Adapter", () => {
  it("Sets the Default VM", () => {
    expect(zSpaceIsActiveAdapter.defaultVM).toEqual(false);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    zSpaceIsActiveAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    zSpaceIsActiveAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
