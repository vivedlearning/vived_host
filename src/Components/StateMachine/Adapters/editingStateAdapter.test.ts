import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockIsEditingStatePM } from "../Mocks/MockIsEditingStatePM";
import { defaultIsEditingStateVM } from "../PMs/EditingStatePM";
import { editingStateAdapter } from "./editingStateAdapter";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const mockPM = makeMockIsEditingStatePM(appObjects);
  return { appObjects, mockPM };
}

describe("Editing state PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(editingStateAdapter.defaultVM).toEqual(defaultIsEditingStateVM);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    editingStateAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    editingStateAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
