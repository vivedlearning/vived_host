import { HostAppObjectRepo } from "../../../HostAppObject";
import { LoggerEntity } from "../Entities";

export function toggleForwardLogs(appObjects: HostAppObjectRepo) {
  const entity = LoggerEntity.get(appObjects);
  if (entity) {
    entity.forwardLogsToConsole = !entity.forwardLogsToConsole;
  } else {
    appObjects.submitError("toggleForwardLogs", "Unable to find LoggerEntity");
  }
}
