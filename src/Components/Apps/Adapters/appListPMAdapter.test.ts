import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockAppsListPM } from "../Mocks/MockAppListPM";
import { appListPMAdapter } from "./appListPMAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeMockAppsListPM(appObjects);
  return { appObjects, mockPM };
}

describe("Selected Challenge Hook Adapter", () => {
  it("Sets the Default VM", () => {
    expect(appListPMAdapter.defaultVM).toEqual([]);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    appListPMAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    appListPMAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
