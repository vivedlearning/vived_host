import { makeAppObjectRepo } from "@vived/core";
import { makeStartInZSpacePMMock } from "../Mocks/StartInZSpacePMMock";
import { startInZSpaceAdapter } from "./startInZSpaceAdapter";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeStartInZSpacePMMock(appObjects);
  return { appObjects, mockPM };
}

describe("Start in zSpace PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(startInZSpaceAdapter.defaultVM).toEqual(false);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    startInZSpaceAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    startInZSpaceAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
