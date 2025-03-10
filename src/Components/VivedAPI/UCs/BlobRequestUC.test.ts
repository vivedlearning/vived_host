import { makeAppObjectRepo } from "@vived/core";
import { BlobRequestUC } from "./BlobRequestUC";
import { makeMockBlobRequestUC } from "../Mocks/MockBlobRequestUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const uc = makeMockBlobRequestUC(appObjects);

  return { uc, appObjects, singletonSpy };
}

describe("JSON Requester", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(BlobRequestUC.get(appObjects)).toEqual(uc);
  });
});
