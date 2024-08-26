import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockActiveAppPM } from "../Mocks/MockActiveAppPM";
import { defaultActiveAppVM } from "../PMs/ActiveAppPM";
import { activeAppPMAdapter } from "./activeAppPMAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeMockActiveAppPM(appObjects);
  return { appObjects, mockPM };
}

describe("Selected Challenge Hook Adapter", () => {
  it("Sets the Default VM", () => {
    expect(activeAppPMAdapter.defaultVM).toEqual(defaultActiveAppVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    activeAppPMAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    activeAppPMAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
