import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockUpdateAppUC } from "../Mocks/MockUpdateAppUC";
import { updateApp } from "./updateApp";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

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
