import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeLoggerEntity } from "../Entities/LoggerEntity";
import {
  ForwardLogsToConsolePM,
  makeForwardLogsToConsolePM
} from "./ForwardLogsToConsolePM";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Logger");
  const loggerEntity = makeLoggerEntity(ao);

  const pm = makeForwardLogsToConsolePM(ao);

  return { loggerEntity, appObjects, pm, registerSingletonSpy };
}

describe("Forward Logs to Console Presentation Manager", () => {
  it("Gets the singleton", () => {
    const { appObjects, pm } = makeTestRig();

    expect(ForwardLogsToConsolePM.get(appObjects)).toEqual(pm);
  });

  it("Registers as a singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    expect(pm.vmsAreEqual(true, true)).toEqual(true);
    expect(pm.vmsAreEqual(false, false)).toEqual(true);

    expect(pm.vmsAreEqual(true, false)).toEqual(false);
    expect(pm.vmsAreEqual(false, true)).toEqual(false);
  });

  it("Initializes the VM", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Updates appropriately when the entity changes are added", () => {
    const { pm, loggerEntity } = makeTestRig();

    loggerEntity.forwardLogsToConsole = true;

    expect(pm.lastVM).toEqual(true);

    loggerEntity.forwardLogsToConsole = false;

    expect(pm.lastVM).toEqual(false);

    loggerEntity.forwardLogsToConsole = true;

    expect(pm.lastVM).toEqual(true);
  });
});
