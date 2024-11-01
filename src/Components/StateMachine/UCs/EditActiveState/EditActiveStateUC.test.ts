import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeMockEditActiveStateUC } from "../../Mocks/MockEditActiveStateUC";
import { EditActiveStateUC } from "./EditActiveStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
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
