import { AppObjectRepo } from "@vived/core";
import { LoggerEntity } from "../Entities";

export function toggleForwardLogs(appObjects: AppObjectRepo) {
  const entity = LoggerEntity.get(appObjects);
  if (entity) {
    entity.forwardLogsToConsole = !entity.forwardLogsToConsole;
  } else {
    appObjects.submitError("toggleForwardLogs", "Unable to find LoggerEntity");
  }
}
