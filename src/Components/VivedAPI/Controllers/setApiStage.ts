import { HostAppObjectRepo } from "../../../HostAppObject";
import { APIStage, VivedAPIEntity } from "../Entities";


export function setApiStage(stage: APIStage, appObjects: HostAppObjectRepo) {
  const sandbox = VivedAPIEntity.get(appObjects);
  if (sandbox) {
    sandbox.apiStage = stage;
  } else {
    appObjects.submitWarning("setApiStage", "Unable to find VivedAPIEntity");
  }
}
