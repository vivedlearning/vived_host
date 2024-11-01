import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeDevFeaturesEnabledPMMock } from "../Mocks/DevFeaturesEnabledPMMock";
import { devFeaturesEnabledAdapter } from "./devFeaturesEnabledAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeDevFeaturesEnabledPMMock(appObjects);
  return { appObjects, mockPM };
}

describe("Dev Features Enabled PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(devFeaturesEnabledAdapter.defaultVM).toEqual(true);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    devFeaturesEnabledAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    devFeaturesEnabledAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
