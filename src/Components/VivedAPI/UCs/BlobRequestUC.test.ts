import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { BlobRequestUC, makeBlobRequestUC } from "./BlobRequestUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const uc = makeBlobRequestUC(appObjects.getOrCreate("ao"));

  return { uc, appObjects, singletonSpy };
}

describe("JSON Requester", () => {
  it("Registers itself as the Singleton", () => {
    const { uc, singletonSpy } = makeTestRig();

    expect(singletonSpy).toBeCalledWith(uc);
  });

  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(BlobRequestUC.get(appObjects)).toEqual(uc);
  });
});
