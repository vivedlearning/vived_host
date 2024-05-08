import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { JsonRequestUC, makeJsonRequestUC } from "./JsonRequestUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const uc = makeJsonRequestUC(appObjects.getOrCreate("ao"));

  return { uc, appObjects, singletonSpy };
}

describe("JSON Requester", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(JsonRequestUC.get(appObjects)).toEqual(uc);
  });
});
