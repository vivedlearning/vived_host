import { makeAppObjectRepo } from "@vived/core";
import { makeMockEditActiveStateUC } from "../../Mocks/MockEditActiveStateUC";
import { EditActiveStateUC } from "./EditActiveStateUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeMockEditActiveStateUC(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("Edit Active State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(EditActiveStateUC.get(appObjects)).toEqual(uc);
  });
});
