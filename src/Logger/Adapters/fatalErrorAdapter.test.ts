import { makeAppObjectRepo } from "@vived/core";
import { fatalErrorAdapter } from "./fatalErrorAdapter";
import { makeMockFatalErrorPM } from "../Mocks/MockFatalErrorPM";
import { defaultFatalErrorVM } from "../PMs";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeMockFatalErrorPM(appObjects);
  return { appObjects, mockPM };
}

describe("Selected Challenge Hook Adapter", () => {
  it("Sets the Default VM", () => {
    expect(fatalErrorAdapter.defaultVM).toEqual(defaultFatalErrorVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    fatalErrorAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    fatalErrorAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
