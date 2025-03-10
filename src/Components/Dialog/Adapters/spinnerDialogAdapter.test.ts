import { makeAppObjectRepo } from "@vived/core";
import { MockSpinnerDialogPM } from "../Mocks";
import { defaultSpinnerDialogVM } from "../PMs";
import { spinnerDialogAdapter } from "./spinnerDialogAdapter";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("id");

  const mockPM = new MockSpinnerDialogPM(ao);
  return { appObjects, mockPM };
}

describe("Spinner Dialog PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(spinnerDialogAdapter.defaultVM).toEqual(defaultSpinnerDialogVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    spinnerDialogAdapter.subscribe("id", appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    spinnerDialogAdapter.unsubscribe("id", appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
