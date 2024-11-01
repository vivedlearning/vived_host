import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeEndActivityUCMock } from "../../Mocks/EndActivityUCMock";
import { EndActivityUC } from "./EndActivityUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const uc = makeEndActivityUCMock(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("Edit Active State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(EndActivityUC.get(appObjects)).toEqual(uc);
  });
});
