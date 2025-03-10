import { makeAppObjectRepo } from "@vived/core";
import { MockUpdateAppUC } from "../Mocks/MockUpdateAppUC";
import { updateApp } from "./updateApp";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();

  const ao = appObjects.getOrCreate("App0");
  const mockUC = new MockUpdateAppUC(ao);

  return { appObjects, mockUC };
}

describe("Update App Controller", () => {
  it("Calls the UC", () => {
    const { appObjects, mockUC } = makeTestRig();

    updateApp("App0", appObjects);

    expect(mockUC.updateApp).toBeCalled();
  });
});
