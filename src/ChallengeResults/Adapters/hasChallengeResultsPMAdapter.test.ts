import { makeAppObjectRepo } from "@vived/core";
import { makeMockHasChallengeResultsPM } from "../Mocks/MockHasChallengeResultsPM";
import { hasChallengeResultsPMAdapter } from "./hasChallengeResultsPMAdapter";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeMockHasChallengeResultsPM(appObjects);
  return { appObjects, mockPM };
}

describe("Has Challenge Results PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(hasChallengeResultsPMAdapter.defaultVM).toEqual(false);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    hasChallengeResultsPMAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    hasChallengeResultsPMAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
