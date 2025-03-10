import { makeAppObjectRepo } from "@vived/core";
import { makeLoggerEntity } from "../Entities";
import { LogSummaryPM, LogSummaryVM, makeLogSummaryPM } from "./LogSummaryPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("Logger");
  const loggerEntity = makeLoggerEntity(ao);

  const pm = makeLogSummaryPM(ao);

  return { loggerEntity, appObjects, pm, registerSingletonSpy };
}

describe("Log Summary Presentation Manager", () => {
  it("Gets the singleton", () => {
    const { appObjects, pm } = makeTestRig();

    expect(LogSummaryPM.get(appObjects)).toEqual(pm);
  });

  it("Registers as a singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    const vm1: LogSummaryVM = {
      errorsLabel: "error label",
      logsLabel: "logs label",
      warningsLabel: "warnings label"
    };

    const vm2: LogSummaryVM = {
      ...vm1
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in the errors label", () => {
    const { pm } = makeTestRig();

    const vm1: LogSummaryVM = {
      errorsLabel: "error label",
      logsLabel: "logs label",
      warningsLabel: "warnings label"
    };

    const vm2: LogSummaryVM = {
      ...vm1,
      errorsLabel: "Changed"
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the logs label", () => {
    const { pm } = makeTestRig();

    const vm1: LogSummaryVM = {
      errorsLabel: "error label",
      logsLabel: "logs label",
      warningsLabel: "warnings label"
    };

    const vm2: LogSummaryVM = {
      ...vm1,
      logsLabel: "Changed"
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the warnings label", () => {
    const { pm } = makeTestRig();

    const vm1: LogSummaryVM = {
      errorsLabel: "error label",
      logsLabel: "logs label",
      warningsLabel: "warnings label"
    };

    const vm2: LogSummaryVM = {
      ...vm1,
      warningsLabel: "Changed"
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Initializes the VM", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Updates appropriately when logs are added", () => {
    const { pm, loggerEntity } = makeTestRig();
    loggerEntity.submitLog("Test", "Message");
    loggerEntity.submitLog("Test", "Message");
    loggerEntity.submitLog("Test", "Message");

    expect(pm.lastVM).toEqual({
      logsLabel: "3 Logs have been submitted",
      warningsLabel: "No Warnings have been submitted",
      errorsLabel: "No Errors have been submitted"
    });
  });

  it("Updates appropriately when warnings are added", () => {
    const { pm, loggerEntity } = makeTestRig();
    loggerEntity.submitWarning("Test", "Message");
    loggerEntity.submitWarning("Test", "Message");
    loggerEntity.submitWarning("Test", "Message");

    expect(pm.lastVM).toEqual({
      logsLabel: "No Logs have been submitted",
      warningsLabel: "3 Warnings have been submitted",
      errorsLabel: "No Errors have been submitted"
    });
  });

  it("Updates appropriately when errors are added", () => {
    const { pm, loggerEntity } = makeTestRig();
    loggerEntity.submitError("Test", "Message");
    loggerEntity.submitError("Test", "Message");
    loggerEntity.submitError("Test", "Message");

    expect(pm.lastVM).toEqual({
      logsLabel: "No Logs have been submitted",
      warningsLabel: "No Warnings have been submitted",
      errorsLabel: "3 Errors have been submitted"
    });
  });
});
