import { makeAppObjectRepo } from "@vived/core";
import { makeMockFatalErrorPM } from "../Mocks/MockFatalErrorPM";
import { FatalErrorPM } from "./FatalErrorPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const mockPM = makeMockFatalErrorPM(appObjects);

  return { mockPM, appObjects };
}

describe("Fatal Error PM", () => {
  it("Gets the singleton", () => {
    const { mockPM, appObjects } = makeTestRig();

    expect(FatalErrorPM.get(appObjects)).toEqual(mockPM);
  });
});
