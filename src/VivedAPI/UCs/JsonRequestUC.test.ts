import { makeAppObjectRepo } from "@vived/core";
import { JsonRequestUC } from "./JsonRequestUC";
import { makeMockJsonRequestUC } from "../Mocks/MockJsonRequestUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const singletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const uc = makeMockJsonRequestUC(appObjects);

  return { uc, appObjects, singletonSpy };
}

describe("JSON Requester", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(JsonRequestUC.get(appObjects)).toEqual(uc);
  });
});
