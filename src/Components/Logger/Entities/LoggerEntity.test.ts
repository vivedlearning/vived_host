import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { LoggerEntity, makeLoggerEntity } from "./LoggerEntity";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const loggerEntity = makeLoggerEntity(appObjects.getOrCreate("log"));
  const observer = jest.fn();

  loggerEntity.addChangeObserver(observer);

  console.warn = jest.fn();
  console.error = jest.fn();

  return { loggerEntity, observer, appObjects, registerSingletonSpy };
}

describe("Logger Entity", () => {
  it("Adds a log", () => {
    const { loggerEntity } = makeTestRig();
    loggerEntity.submitLog("sender", "message");

    let entry = loggerEntity.logs[0];

    expect(entry.sender).toBe("sender");
    expect(entry.message).toBe("message");
    expect(entry.severity).toBe("LOG");
  });

  it("Notifies when a log is added", () => {
    const { loggerEntity, observer } = makeTestRig();

    loggerEntity.submitLog("sender", "message");
    expect(observer).toBeCalled();
  });

  it("Add a warning", () => {
    const { loggerEntity } = makeTestRig();
    loggerEntity.submitWarning("sender", "message");

    let entry = loggerEntity.logs[0];

    expect(entry.sender).toBe("sender");
    expect(entry.message).toBe("message");
    expect(entry.severity).toBe("WARNING");
  });

  it("Notifies when a warn log is added", () => {
    const { loggerEntity, observer } = makeTestRig();

    loggerEntity.submitWarning("sender", "message");
    expect(observer).toBeCalled();
  });

  it("Adds an error", () => {
    const { loggerEntity } = makeTestRig();
    loggerEntity.submitError("sender", "message");

    let entry = loggerEntity.logs[0];

    expect(entry.sender).toBe("sender");
    expect(entry.message).toBe("message");
    expect(entry.severity).toBe("ERROR");
  });

  it("Notifies when a error log is added", () => {
    const { loggerEntity, observer } = makeTestRig();

    loggerEntity.submitError("sender", "message");
    expect(observer).toBeCalled();
  });

  it("Adds a fatal", () => {
    const { loggerEntity } = makeTestRig();
    loggerEntity.submitFatal("sender", "message");

    let entry = loggerEntity.logs[0];

    expect(entry.sender).toBe("sender");
    expect(entry.message).toBe("message");
    expect(entry.severity).toBe("FATAL");
  });

  it("Notifies when a fatal log is added", () => {
    const { loggerEntity, observer } = makeTestRig();

    loggerEntity.submitFatal("sender", "message");
    expect(observer).toBeCalled();
  });

  it("Clears the logs", () => {
    const { loggerEntity } = makeTestRig();

    loggerEntity.submitError("sender", "message");
    loggerEntity.submitError("sender", "message");
    loggerEntity.submitError("sender", "message");
    loggerEntity.submitError("sender", "message");

    loggerEntity.clear();

    expect(loggerEntity.logs).toEqual([]);
  });

  it("Injects itself into the App Objects log system", () => {
    const { appObjects, observer, loggerEntity } = makeTestRig();

    expect(loggerEntity.logs).toHaveLength(0);

    appObjects.submitLog("some log", "some message");

    expect(observer).toBeCalled();
    expect(loggerEntity.logs).toHaveLength(1);
    expect(loggerEntity.logs[0].severity).toEqual("LOG");
  });

  it("Injects itself into the App Objects warn system", () => {
    const { appObjects, observer, loggerEntity } = makeTestRig();

    expect(loggerEntity.logs).toHaveLength(0);

    appObjects.submitWarning("some log", "some message");

    expect(observer).toBeCalled();
    expect(loggerEntity.logs).toHaveLength(1);
    expect(loggerEntity.logs[0].severity).toEqual("WARNING");
  });

  it("Injects itself into the App Objects error system", () => {
    const { appObjects, observer, loggerEntity } = makeTestRig();

    expect(loggerEntity.logs).toHaveLength(0);

    appObjects.submitError("some log", "some message");

    expect(observer).toBeCalled();
    expect(loggerEntity.logs).toHaveLength(1);
    expect(loggerEntity.logs[0].severity).toEqual("ERROR");
  });

  it("Injects itself into the App Objects fatal system", () => {
    const { appObjects, observer, loggerEntity } = makeTestRig();

    expect(loggerEntity.logs).toHaveLength(0);

    appObjects.submitFatal("some log", "some message");

    expect(observer).toBeCalled();
    expect(loggerEntity.logs).toHaveLength(1);
    expect(loggerEntity.logs[0].severity).toEqual("FATAL");
  });

  it("Forwards a log to console if the flag is set", () => {
    const { loggerEntity } = makeTestRig();

    console.log = jest.fn();
    loggerEntity.forwardLogsToConsole = true;

    loggerEntity.submitLog("Sender", "A Message");

    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith(`[Sender] A Message`);

    loggerEntity.forwardLogsToConsole = false;

    loggerEntity.submitLog("Sender", "A Message");
    loggerEntity.submitLog("Sender", "A Message");
    loggerEntity.submitLog("Sender", "A Message");

    expect(console.log).toBeCalledTimes(1);
  });

  it("Forwards warnings to the console", () => {
    const { loggerEntity } = makeTestRig();

    console.warn = jest.fn();

    loggerEntity.submitWarning("Sender", "A Message");

    expect(console.warn).toBeCalledWith(`[Sender] A Message`);
  });

  it("Forwards error to the consoles", () => {
    const { loggerEntity } = makeTestRig();

    console.error = jest.fn();

    loggerEntity.submitError("Sender", "A Message");

    expect(console.error).toBeCalledWith(`[Sender] A Message`);
  });

  it("Logs an fatal to the consoles as an error", () => {
    const { loggerEntity } = makeTestRig();

    console.error = jest.fn();

    loggerEntity.submitFatal("Sender", "A Message");

    expect(console.error).toBeCalledWith(`[Sender] A Message`);
  });

  it("Gets the singleton", () => {
    const { loggerEntity, appObjects } = makeTestRig();

    expect(LoggerEntity.get(appObjects)).toEqual(loggerEntity);
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, loggerEntity } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(loggerEntity);
  });

  it("Stores the last log", () => {
    const { loggerEntity } = makeTestRig();

    expect(loggerEntity.lastLog).toBeUndefined();

    loggerEntity.submitLog("Sender", "Message 1");
    loggerEntity.submitLog("Sender", "A Message 2");
    loggerEntity.submitLog("Sender", "A Message 3");

    expect(loggerEntity.lastLog?.message).toEqual("A Message 3");
  });

  it("Clears the last log", () => {
    const { loggerEntity } = makeTestRig();

    loggerEntity.submitLog("Sender", "Message 1");
    loggerEntity.submitLog("Sender", "A Message 2");
    loggerEntity.submitLog("Sender", "A Message 3");

    expect(loggerEntity.lastLog?.message).toEqual("A Message 3");

    loggerEntity.clear();

    expect(loggerEntity.lastLog).toBeUndefined();
  });
});
