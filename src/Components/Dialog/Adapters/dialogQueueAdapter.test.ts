import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockDialogQueuePM } from "../Mocks";
import { defaultDialogVM } from "../PMs";
import { dialogQueueAdapter } from "./dialogQueueAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeMockDialogQueuePM(appObjects);
  return { appObjects, mockPM };
}

describe("Dialog Queue PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(dialogQueueAdapter.defaultVM).toEqual(defaultDialogVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    dialogQueueAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    dialogQueueAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
