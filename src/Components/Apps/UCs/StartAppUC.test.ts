import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { MockStartAppUC } from "../Mocks/MockStartAppUC";
import { StartAppUC } from "./StartAppUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const ao = appObjects.getOrCreate("App1");
  const uc = new MockStartAppUC(ao);

  return {
    uc,
    ao,
    appObjects
  };
}

describe("Start App UC", () => {
  it("Gets an app object", () => {
    const { ao, uc } = makeTestRig();

    expect(StartAppUC.get(ao)).toEqual(uc);
  });

  it("Gets by ID", () => {
    const { uc, appObjects } = makeTestRig();

    expect(StartAppUC.getByID("App1", appObjects)).toEqual(uc);
  });

  it("Starts by ID", () => {
    const { uc, appObjects } = makeTestRig();

    uc.start = jest.fn();
    const container = document.createElement("div");

    StartAppUC.startByID(container, "App1", appObjects);
    expect(uc.start).toBeCalledWith(container);
  });
});
