import { makeAppObjectRepo } from "@vived/core";
import { makeMockStopZSpaceUC } from "../../Mocks";
import { StopZSpaceUC } from "./StopZSpaceUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockUC = makeMockStopZSpaceUC(appObjects);

  return {
    mockUC,
    appObjects
  };
}

describe("Stop ZSpace Use Case", () => {
  it("Gets the singleton", () => {
    const { appObjects, mockUC } = makeTestRig();

    expect(StopZSpaceUC.get(appObjects)).toEqual(mockUC);
  });
});
