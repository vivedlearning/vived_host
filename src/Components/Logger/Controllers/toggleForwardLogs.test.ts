import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeLoggerEntity } from "../Entities";
import { makeMockDownloadLogUC } from "../Mocks/MockDownloadLogUC";
import { toggleForwardLogs } from "./toggleForwardLogs";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();

  const entity = makeLoggerEntity(appObjects.getOrCreate("Logger"));

  return { appObjects, entity };
}

describe("Toggle forward logs", () => {
  it("Toggles the flag", () => {
    const { appObjects, entity } = makeTestRig();

    entity.forwardLogsToConsole = true;

    toggleForwardLogs(appObjects);

    expect(entity.forwardLogsToConsole).toEqual(false);

    toggleForwardLogs(appObjects);

    expect(entity.forwardLogsToConsole).toEqual(true);
  });
});
