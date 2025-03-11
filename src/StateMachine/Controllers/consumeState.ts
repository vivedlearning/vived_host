import { AppObjectRepo } from "@vived/core";
import { ConsumeStateUC } from "../UCs/ConsumeState/ConsumeStateUC";

export function consumeState(id: string, appObjects: AppObjectRepo) {
  const uc = ConsumeStateUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning("consumeState", "Unable to find ConsumeStateUC");
    return;
  }

  uc.consume(id);
}
