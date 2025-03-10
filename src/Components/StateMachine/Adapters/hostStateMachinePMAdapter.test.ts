import { makeAppObjectRepo } from "@vived/core";
import { makeMockHostStateMachinePM } from "../Mocks/MockHostStateMachinePM";
import { defaultHostStateMachineVM } from "../PMs";
import { hostStateMachinePMAdapter } from "./hostStateMachinePMAdapter";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeMockHostStateMachinePM(appObjects);
  return { appObjects, mockPM };
}

describe("Selected Challenge Hook Adapter", () => {
  it("Sets the Default VM", () => {
    expect(hostStateMachinePMAdapter.defaultVM).toEqual(
      defaultHostStateMachineVM
    );
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    hostStateMachinePMAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    hostStateMachinePMAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
