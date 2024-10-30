import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { BasicFetchUC } from "./BasicFetchUC";
import { makeMockBasicFetchUC } from "../Mocks/MockBasicFetchUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const uc = makeMockBasicFetchUC(appObjects);

  return { uc, appObjects, singletonSpy };
}

describe("JSON Requester", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(BasicFetchUC.get(appObjects)).toEqual(uc);
  });
});
