import { makeAppObjectRepo } from "@vived/core";
import { MockStartZSpaceUC } from "../Mocks/MockStartZSpaceUC";
import { startZSpace } from "./startZSpace";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockUC = new MockStartZSpaceUC(appObjects.getOrCreate("AO"));

  return { appObjects, mockUC };
}

describe("Start zSpace Controller", () => {
  it("Triggers the UC", () => {
    const { appObjects, mockUC } = makeTestRig();

    startZSpace(appObjects);

    expect(mockUC.startZSpace).toBeCalled();
  });
});
