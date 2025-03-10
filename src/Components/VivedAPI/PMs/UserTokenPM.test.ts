import { makeAppObjectRepo } from "@vived/core";
import { VivedAPIEntity } from "../Entities";
import { UserTokenPM, makeUserTokenPM } from "./UserTokenPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Sandbox");
  const apiEntity = new VivedAPIEntity(ao);
  const pm = makeUserTokenPM(ao);

  return {
    registerSingletonSpy,
    pm,
    apiEntity,
    appObjects
  };
}

describe("User Token PM", () => {
  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();

    expect(UserTokenPM.get(appObjects)).toEqual(pm);
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
    const { pm, apiEntity } = makeTestRig();
    apiEntity.userToken = "aNewToken";

    expect(pm.lastVM).toEqual("aNewToken");
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    expect(pm.vmsAreEqual("aToken", "aToken")).toEqual(true);
    expect(pm.vmsAreEqual("aToken", "ChangedToken")).toEqual(false);
  });
});
