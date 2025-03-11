import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { APIStage } from "../Entities";
import { ApiStagePM } from "../PMs/ApiStagePM";

export const apiStageAdapter: SingletonPmAdapter<APIStage> = {
  defaultVM: APIStage.PRODUCTION,
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: APIStage) => void) => {
    const pm = ApiStagePM.get(appObjects);
    if (!pm) {
      appObjects.submitError("apiStageAdapter", "Unable to find ApiStagePM");
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: APIStage) => void) => {
    const pm = ApiStagePM.get(appObjects);
    if (!pm) {
      appObjects.submitError("apiStageAdapter", "Unable to find ApiStagePM");
      return;
    }
    pm.removeView(setVM);
  }
};
