import { makeAppObjectRepo } from "@vived/core";
import { APIStage, VivedAPIEntity } from "../Entities";
import { ApiStagePM, makeApiStagePM } from "./ApiStagePM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Sandbox");
  const sandbox = new VivedAPIEntity(ao);
  const pm = makeApiStagePM(ao);

  return {
    registerSingletonSpy,
    pm,
    sandbox,
    appObjects
  };
}

describe("Api Stage PM", () => {
  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();

    expect(ApiStagePM.get(appObjects)).toEqual(pm);
  });

  it("Registers as the singleton", () => {
    const { pm, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Initializes the VM", () => {
    const { pm } = makeTestRig();

    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Updates when the entity changes", () => {
    const { pm, sandbox } = makeTestRig();
    sandbox.apiStage = APIStage.DEVELOPMENT;
    sandbox.apiStage = APIStage.PRODUCTION;

    expect(pm.lastVM).toEqual(APIStage.PRODUCTION);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    expect(pm.vmsAreEqual(APIStage.DEVELOPMENT, APIStage.DEVELOPMENT)).toEqual(
      true
    );
    expect(pm.vmsAreEqual(APIStage.DEVELOPMENT, APIStage.LOCAL)).toEqual(false);
  });
});
