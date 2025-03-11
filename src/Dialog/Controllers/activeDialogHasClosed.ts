import { AppObjectRepo } from "@vived/core";
import { DialogQueue } from "../Entities";

export function activeDialogHasClosed(appObjects: AppObjectRepo) {
  const dialogQueue = DialogQueue.get(appObjects);
  if (dialogQueue) {
    dialogQueue.activeDialogHasClosed();
  } else {
    appObjects.submitWarning(
      "activeDialogHasClosed",
      "Unable to find DialogQueue"
    );
  }
}
