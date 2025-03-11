import { makeAppObjectRepo } from "@vived/core";
import { snackbarAdapter } from "./snackbarAdapter";
import { makeSnackbarPMMock } from "../Mocks/SnackbarPMMock";
import { defaultSnackbarVM } from "../PMs/SnackbarPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeSnackbarPMMock(appObjects);
  return { appObjects, mockPM };
}

describe("Snackbar PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(snackbarAdapter.defaultVM).toEqual(defaultSnackbarVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    snackbarAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    snackbarAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
