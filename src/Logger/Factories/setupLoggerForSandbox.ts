import { AppObjectRepo } from "@vived/core";
import { makeLoggerEntity } from "../Entities";
import { makeForwardLogsToConsolePM, makeLogSummaryPM } from "../PMs";
import { makeDownloadLogUC } from "../UCs";

export function setupLoggerForSandbox(appObjects: AppObjectRepo) {
  const ao = appObjects.getOrCreate("Logger");

  // Entities
  makeLoggerEntity(ao);

  // UCs
  makeDownloadLogUC(ao);

  // PMs
  makeLogSummaryPM(ao);
  makeForwardLogsToConsolePM(ao);
}
