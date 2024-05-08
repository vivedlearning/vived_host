import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { BasicFetchUC, makeBasicFetchUC } from "./BasicFetchUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const uc = makeBasicFetchUC(appObjects.getOrCreate("ao"));

  return { uc, appObjects, singletonSpy };
}

describe("JSON Requester", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(BasicFetchUC.get(appObjects)).toEqual(uc);
  });
});
