import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockAppPM } from "../Mocks/MockAppPM";
import { defaultAppVM } from "../PMs/AppPM";
import { appPMAdapter } from "./appPMAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("app1");

  const mockPM = new MockAppPM(ao);
  return { appObjects, mockPM };
}

describe("Selected Challenge Hook Adapter", () => {
  it("Sets the Default VM", () => {
    expect(appPMAdapter.defaultVM).toEqual(defaultAppVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    appPMAdapter.subscribe("app1", appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    appPMAdapter.unsubscribe("app1", appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
