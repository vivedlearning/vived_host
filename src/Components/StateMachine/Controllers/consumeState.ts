import { HostAppObjectRepo } from "../../../HostAppObject";
import { ConsumeStateUC } from "../UCs/ConsumeStateUC";

export function consumeState(id: string, appObjects: HostAppObjectRepo) {
  const uc = ConsumeStateUC.get(appObjects);

  if (!uc) {
    appObjects.submitWarning("consumeState", "Unable to find ConsumeStateUC");
    return;
  }

  uc.consume(id);
}
