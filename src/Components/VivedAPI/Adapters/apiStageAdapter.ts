import { HostAppObjectRepo } from "../../../HostAppObject";
import { SingletonPmAdapter } from "../../../Types";
import { APIStage } from "../Entities";
import { ApiStagePM } from "../PMs/ApiStagePM";



export const apiStageAdapter: SingletonPmAdapter<APIStage> = {
  defaultVM: APIStage.PRODUCTION,
  subscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: APIStage) => void
  ) => {
    const pm = ApiStagePM.get(appObjects);
    if (!pm) {
      appObjects.submitError("apiStageAdapter", "Unable to find ApiStagePM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    appObjects: HostAppObjectRepo,
    setVM: (vm: APIStage) => void
  ) => {
    const pm = ApiStagePM.get(appObjects);
    if (!pm) {
      appObjects.submitError("apiStageAdapter", "Unable to find ApiStagePM");
      return;
    }
    pm.removeView(setVM);
  }
};
