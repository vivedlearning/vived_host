import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeNewStateUCMock } from "../../Mocks/NewStateUCMock";
import { NewStateUC } from "./NewStateUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const uc = makeNewStateUCMock(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("New State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(NewStateUC.get(appObjects)).toEqual(uc);
  });
});
