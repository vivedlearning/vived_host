import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeLoggerEntity } from "../Entities/LoggerEntity";
import { DownloadLogUC, makeDownloadLogUC } from "./DownloadLogUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const logger = makeLoggerEntity(appObjects.getOrCreate("Logger"));
  logger.submitLog("Sender", "Message");
  const mockDownloadFile = jest.fn();

  const uc = makeDownloadLogUC(appObjects.getOrCreate("AO"));
  uc.downloadFile = mockDownloadFile;

  return { logger, appObjects, uc, mockDownloadFile, registerSingletonSpy };
}

describe("Download Log File UC", () => {
  it("Gets the singleton", () => {
    const { uc, appObjects } = makeTestRig();

    expect(DownloadLogUC.get(appObjects)).toEqual(uc);
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, uc } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(uc);
  });

  it("Calls download", () => {
    const { uc, mockDownloadFile } = makeTestRig();

    uc.doDownload();

    expect(mockDownloadFile).toBeCalledTimes(1);
    expect(mockDownloadFile.mock.calls[0][0]).toEqual("vivedPlayerLog.json");
    const file = mockDownloadFile.mock.calls[0][1] as File;
    expect(file.size).toBeGreaterThan(0);
  });
});
