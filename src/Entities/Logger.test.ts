import { makeLoggerEntity } from "./Logger";

function makeTestRig() {
  const loggerEntity = makeLoggerEntity();
  const onSaveObserver = jest.fn();
  const onLogAddedObserver = jest.fn();

  loggerEntity.addLogSaveObserver(onSaveObserver);
  loggerEntity.addLogAddedObserver(onLogAddedObserver);

  return { loggerEntity, onSaveObserver, onLogAddedObserver };
}

describe("Logger Entity", () => {
  it("Initializes as expected", () => {
    const { loggerEntity } = makeTestRig();
    expect(loggerEntity).toBeTruthy();
    expect(loggerEntity.getAllLogs()).toStrictEqual([]);
  });

  it("Adds a log", () => {
    const { loggerEntity } = makeTestRig();
    loggerEntity.log("sender", "message");

    let theLog = loggerEntity.getAllLogs()[0];

    expect(theLog.sender).toBe("sender");
    expect(theLog.message).toBe("message");
    expect(theLog.severity).toBe("LOG");
  });

  it("Notifies when a log is added", () => {
    const { loggerEntity, onLogAddedObserver } = makeTestRig();

    loggerEntity.log("sender", "message");
    expect(onLogAddedObserver).toBeCalledWith({
      sender: "sender",
      message: "message",
      severity: "LOG",
    });
  });

  test("Logger Entity - test add warning", () => {
    const { loggerEntity } = makeTestRig();
    loggerEntity.warn("sender", "message");

    let theLog = loggerEntity.getAllLogs()[0];

    expect(theLog.sender).toBe("sender");
    expect(theLog.message).toBe("message");
    expect(theLog.severity).toBe("WARNING");
  });

  it("Notifies when a warn log is added", () => {
    const { loggerEntity, onLogAddedObserver } = makeTestRig();

    loggerEntity.warn("sender", "message");
    expect(onLogAddedObserver).toBeCalledWith({
      sender: "sender",
      message: "message",
      severity: "WARNING",
    });
  });

  test("Logger Entity - test add error", () => {
    const { loggerEntity } = makeTestRig();
    loggerEntity.error("sender", "message");

    let theLog = loggerEntity.getAllLogs()[0];

    expect(theLog.sender).toBe("sender");
    expect(theLog.message).toBe("message");
    expect(theLog.severity).toBe("ERROR");
  });

  it("Notifies when a error log is added", () => {
    const { loggerEntity, onLogAddedObserver } = makeTestRig();

    loggerEntity.error("sender", "message");
    expect(onLogAddedObserver).toBeCalledWith({
      sender: "sender",
      message: "message",
      severity: "ERROR",
    });
  });

  test("Logger Entity - test add fatal", () => {
    const { loggerEntity } = makeTestRig();
    loggerEntity.fatal("sender", "message");

    let theLog = loggerEntity.getAllLogs()[0];

    expect(theLog.sender).toBe("sender");
    expect(theLog.message).toBe("message");
    expect(theLog.severity).toBe("FATAL");
  });

  it("Notifies when a fatal log is added", () => {
    const { loggerEntity, onLogAddedObserver } = makeTestRig();

    loggerEntity.fatal("sender", "message");
    expect(onLogAddedObserver).toBeCalledWith({
      sender: "sender",
      message: "message",
      severity: "FATAL",
    });
  });

  it("Allows an on add observer to be removed", () => {
    const { loggerEntity, onLogAddedObserver } = makeTestRig();
    loggerEntity.removeLogAddedObserver(onLogAddedObserver);

    loggerEntity.fatal("sender", "message");
    loggerEntity.error("sender", "message");
    loggerEntity.warn("sender", "message");
    loggerEntity.log("sender", "message");

    expect(onLogAddedObserver).not.toBeCalled();
  });

  test("Logger Entity - test clear logs", () => {
    const { loggerEntity } = makeTestRig();

    loggerEntity.error("sender", "message");
    loggerEntity.error("sender", "message");
    loggerEntity.error("sender", "message");
    loggerEntity.error("sender", "message");

    loggerEntity.clear();

    expect(loggerEntity.getAllLogs()).toStrictEqual([]);
  });

  test("Logger Entity - test getAllLogs and filter", () => {
    const { loggerEntity } = makeTestRig();

    loggerEntity.log("senderA", "messageV");
    loggerEntity.error("senderB", "messageX");
    loggerEntity.warn("senderC", "messageT");

    //EXACT MATCH
    loggerEntity.setFilter("severity", "WARNING");
    expect(loggerEntity.getFilteredLogs()).toStrictEqual([
      { sender: "senderC", message: "messageT", severity: "WARNING" },
    ]);

    loggerEntity.setFilter("severity", "ERROR");
    expect(loggerEntity.getFilteredLogs()).toStrictEqual([
      { sender: "senderB", message: "messageX", severity: "ERROR" },
    ]);

    loggerEntity.setFilter("severity", "LOG");
    expect(loggerEntity.getFilteredLogs()).toStrictEqual([
      { sender: "senderA", message: "messageV", severity: "LOG" },
    ]);

    loggerEntity.setFilter("sender", "senderB");
    expect(loggerEntity.getFilteredLogs()).toStrictEqual([
      { sender: "senderB", message: "messageX", severity: "ERROR" },
    ]);

    loggerEntity.setFilter("message", "messageV");
    expect(loggerEntity.getFilteredLogs()).toStrictEqual([
      { sender: "senderA", message: "messageV", severity: "LOG" },
    ]);

    //SIMILAR MATCH

    loggerEntity.setFilter("severity", "WAR");
    expect(loggerEntity.getFilteredLogs()).toStrictEqual([
      { sender: "senderC", message: "messageT", severity: "WARNING" },
    ]);

    loggerEntity.setFilter("sender", "C");
    expect(loggerEntity.getFilteredLogs()).toStrictEqual([
      { sender: "senderC", message: "messageT", severity: "WARNING" },
    ]);

    loggerEntity.setFilter("message", "T");
    expect(loggerEntity.getFilteredLogs()).toStrictEqual([
      { sender: "senderC", message: "messageT", severity: "WARNING" },
    ]);
  });

  test("Logger Entity - test if onSaveObserver is added and called", () => {
    const { loggerEntity, onSaveObserver } = makeTestRig();

    loggerEntity.toggleShowLogs();

    loggerEntity.log("sender", "message");
    loggerEntity.warn("sender", "message");
    loggerEntity.error("sender", "message");

    expect(onSaveObserver).toBeTruthy();
    expect(onSaveObserver).toBeCalledTimes(3);
  });

  test("Logger Entity - test if onSaveObserver is removed and called", () => {
    const { loggerEntity, onSaveObserver } = makeTestRig();

    loggerEntity.removeLogSavedObserver(onSaveObserver);

    loggerEntity.log("sender", "message");
    loggerEntity.warn("sender", "message");
    loggerEntity.error("sender", "message");

    expect(onSaveObserver).toBeTruthy();
    expect(onSaveObserver).toBeCalledTimes(0);
  });

  test("Logger Entity - test toggle showLogs", () => {
    const { loggerEntity, onSaveObserver } = makeTestRig();

    loggerEntity.toggleShowLogs();

    loggerEntity.log("sender", "message");

    expect(onSaveObserver).toHaveBeenCalledWith({
      instruction: "SHOWLOG",
      payload: { message: "message", sender: "sender", severity: "LOG" },
    });

    loggerEntity.toggleShowLogs();

    loggerEntity.log("sender", "message");

    expect(onSaveObserver).toBeCalledTimes(1);
  });

  test("Logger Entity - test download log file", () => {
    let { loggerEntity, onSaveObserver } = makeTestRig();

    loggerEntity.log("sender", "message");

    loggerEntity.downloadLogs();

    expect(onSaveObserver).toBeTruthy();
    expect(onSaveObserver).toHaveBeenCalledWith({
      instruction: "DOWNLOAD",
      payload: {
        fileData: {
          filterBy: undefined,
          filterValue: undefined,
          logs: [{ message: "message", sender: "sender", severity: "LOG" }],
        },
        filename: "playerLogs.json",
      },
    });
  });

  test("Logger Entity - test display all logs", () => {
    const { loggerEntity, onSaveObserver } = makeTestRig();

    loggerEntity.log("sender", "message");
    loggerEntity.displayAllLogs();

    expect(onSaveObserver).toBeTruthy();
    expect(onSaveObserver).toHaveBeenCalledWith({
      instruction: "SHOWALL",
      payload: [{ message: "message", sender: "sender", severity: "LOG" }],
    });
  });

  test("Logger Entity - test set filter", () => {
    const { loggerEntity, onSaveObserver } = makeTestRig();

    loggerEntity.setFilter("severity", "log");

    loggerEntity.log("sender", "message");
    loggerEntity.warn("sender", "message");

    loggerEntity.displayAllLogs();

    expect(onSaveObserver).toBeTruthy();
    expect(onSaveObserver).toHaveBeenCalledWith({
      instruction: "SHOWALL",
      payload: [{ message: "message", sender: "sender", severity: "LOG" }],
    });
  });

  test("Logger Entity - test clear filter", () => {
    const { loggerEntity, onSaveObserver } = makeTestRig();

    loggerEntity.setFilter("severity", "log");
    loggerEntity.clearFilter();

    loggerEntity.log("sender", "message");
    loggerEntity.warn("sender", "message");

    loggerEntity.displayAllLogs();

    expect(onSaveObserver).toBeTruthy();
    expect(onSaveObserver).toHaveBeenCalledWith({
      instruction: "SHOWALL",
      payload: [
        { message: "message", sender: "sender", severity: "LOG" },
        { message: "message", sender: "sender", severity: "WARNING" },
      ],
    });
  });
});
