import { makeHostAppObjectRepo } from "../../../HostAppObject/HostAppObjectRepo";
import { makeShowInspectorPMMock } from "../Mocks/ShowInspectorPMMock";
import { showInspectorAdapter } from "./showInspectorAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeShowInspectorPMMock(appObjects);
  return { appObjects, mockPM };
}

describe("Render App PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(showInspectorAdapter.defaultVM).toEqual(false);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    showInspectorAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    showInspectorAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
