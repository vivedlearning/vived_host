import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeEmulateZSpacePMMock } from "../Mocks/EmulateZSpacePMMock";
import { emulateZSpaceAdapter } from "./emulateZSpaceAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeEmulateZSpacePMMock(appObjects);
  return { appObjects, mockPM };
}

describe("Emulate ZSpace Adapter", () => {
  it("Sets the Default VM", () => {
    expect(emulateZSpaceAdapter.defaultVM).toEqual(false);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    emulateZSpaceAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    emulateZSpaceAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
