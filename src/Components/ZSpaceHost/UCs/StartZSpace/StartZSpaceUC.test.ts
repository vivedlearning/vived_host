import { makeAppObjectRepo } from "@vived/core";
import { makeMockStartZSpaceUC } from "../../Mocks/MockStartZSpaceUC";
import { StartZSpaceUC } from "./StartZSpaceUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockUC = makeMockStartZSpaceUC(appObjects);

  return {
    mockUC,
    appObjects
  };
}

describe("Start ZSpace Use Case", () => {
  it("Gets the singleton", () => {
    const { appObjects, mockUC } = makeTestRig();

    expect(StartZSpaceUC.get(appObjects)).toEqual(mockUC);
  });
});
