import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { logSummaryAdapter } from "./logSummaryAdapter";
import { makeLogSummaryPMMock } from "../Mocks/LogSummaryPMMock";
import { defaultVM } from "../PMs/LogSummaryPM";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeLogSummaryPMMock(appObjects);
  return { appObjects, mockPM };
}

describe("Log Summary PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(logSummaryAdapter.defaultVM).toEqual(defaultVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    logSummaryAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    logSummaryAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
