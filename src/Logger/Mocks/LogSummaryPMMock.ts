import { AppObject, AppObjectRepo } from "@vived/core";
import { LogSummaryPM } from "../PMs";

export class LogSummaryPMMock extends LogSummaryPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, LogSummaryPM.type);
  }
}

export function makeLogSummaryPMMock(appObjects: AppObjectRepo) {
  return new LogSummaryPMMock(appObjects.getOrCreate("LogSummaryPMMock"));
}
