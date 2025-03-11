import { makeAppObjectRepo } from "@vived/core";
import { MockStopZSpaceUC } from "../Mocks/MockStopZSpaceUC";
import { stopZSpace } from "./stopZSpace";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockUC = new MockStopZSpaceUC(appObjects.getOrCreate("AO"));

  return { appObjects, mockUC };
}

describe("Start zSpace Controller", () => {
  it("Triggers the UC", () => {
    const { appObjects, mockUC } = makeTestRig();

    stopZSpace(appObjects);

    expect(mockUC.stopZSpace).toBeCalled();
  });
});
