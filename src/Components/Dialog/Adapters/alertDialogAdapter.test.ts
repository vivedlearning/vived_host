import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockAlertDialogPM } from "../Mocks";
import { defaultAlertDialogVM } from "../PMs";
import { alertDialogAdapter } from "./alertDialogAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("id");

  const mockPM = new MockAlertDialogPM(ao);
  return { appObjects, mockPM };
}

describe("Alert Dialog Adapter", () => {
  it("Sets the Default VM", () => {
    expect(alertDialogAdapter.defaultVM).toEqual(defaultAlertDialogVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    alertDialogAdapter.subscribe("id", appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    alertDialogAdapter.unsubscribe("id", appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
