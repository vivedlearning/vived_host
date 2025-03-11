import { makeAppObjectRepo } from "@vived/core";
import { makeConsumeStateUCMock } from "../../Mocks/ConsumeStateUCMock";
import { ConsumeStateUC } from "./ConsumeStateUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const uc = makeConsumeStateUCMock(appObjects);

  return {
    uc,
    appObjects
  };
}

describe("Consume State UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(ConsumeStateUC.get(appObjects)).toEqual(uc);
  });
});
