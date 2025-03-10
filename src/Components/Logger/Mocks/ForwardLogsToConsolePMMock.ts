import { AppObject, AppObjectRepo } from "@vived/core";
import { ForwardLogsToConsolePM } from "../PMs/ForwardLogsToConsolePM";

export class ForwardLogsToConsolePMMock extends ForwardLogsToConsolePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: AppObject) {
    super(appObject, ForwardLogsToConsolePM.type);
  }
}

export function makeForwardLogsToConsolePMMock(appObjects: AppObjectRepo) {
  return new ForwardLogsToConsolePMMock(
    appObjects.getOrCreate("ForwardLogsToConsolePMMock")
  );
}
