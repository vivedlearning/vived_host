import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockStopZSpaceUC } from "../Mocks/MockStopZSpaceUC";
import { stopZSpace } from "./stopZSpace";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
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
