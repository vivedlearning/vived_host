import { makeAppObjectRepo } from "@vived/core";
import { APIStage } from "../Entities";
import { makeApiStagePMMock } from "../Mocks/ApiStagePMMock";
import { apiStageAdapter } from "./apiStageAdapter";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeApiStagePMMock(appObjects);
  return { appObjects, mockPM };
}

describe("API Stage PM Adapter", () => {
  it("Sets the Default VM", () => {
    expect(apiStageAdapter.defaultVM).toEqual(APIStage.PRODUCTION);
  });

  it("Add a view on subscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.addView = jest.fn();
    const setVM = jest.fn();

    apiStageAdapter.subscribe(appObjects, setVM);

    expect(mockPM.addView).toBeCalledWith(setVM);
  });

  it("Removes a view on unsubscribe", () => {
    const { mockPM, appObjects } = makeTestRig();

    mockPM.removeView = jest.fn();
    const setVM = jest.fn();

    apiStageAdapter.unsubscribe(appObjects, setVM);

    expect(mockPM.removeView).toBeCalledWith(setVM);
  });
});
