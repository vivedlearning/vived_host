import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { ForwardLogsToConsolePM } from "../PMs/ForwardLogsToConsolePM";

export class ForwardLogsToConsolePMMock extends ForwardLogsToConsolePM {
  vmsAreEqual = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, ForwardLogsToConsolePM.type);
  }
}

export function makeForwardLogsToConsolePMMock(appObjects: HostAppObjectRepo) {
  return new ForwardLogsToConsolePMMock(
    appObjects.getOrCreate("ForwardLogsToConsolePMMock")
  );
}
