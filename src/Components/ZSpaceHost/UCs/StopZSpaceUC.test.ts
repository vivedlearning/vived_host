import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockStopZSpaceUC } from "../Mocks/MockStopZSpaceUC";
import { StopZSpaceUC } from "./StopZSpaceUC";


function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
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

