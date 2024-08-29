import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockConfirmDialogPM } from "../Mocks";
import { defaultConfirmDialogVM } from "../PMs";
import { confirmDialogAdapter } from "./confirmDialogAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("id");

  const mockPM = new MockConfirmDialogPM(ao);
  return { appObjects, mockPM };
}

describe("Confirm Dialog Adapter", () => {
  it("Sets the Default VM", () => {
    expect(confirmDialogAdapter.defaultVM).toEqual(defaultConfirmDialogVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    confirmDialogAdapter.subscribe("id", appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    confirmDialogAdapter.unsubscribe("id", appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
