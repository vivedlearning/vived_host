import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { LogSummaryPM } from "../PMs";

export class LogSummaryPMMock extends LogSummaryPM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, LogSummaryPM.type);
  }
}

export function makeLogSummaryPMMock(appObjects: HostAppObjectRepo) {
  return new LogSummaryPMMock(appObjects.getOrCreate("LogSummaryPMMock"));
}
