import { AppObjectRepo, PmAdapter } from "@vived/core";
import {
  MarkDownEditorDialogVM,
  MarkDownEditorDialogPM,
  defaultMarkDownEditorDialogVM
} from "../PMs";

export const markDownEditorDialogAdapters: PmAdapter<MarkDownEditorDialogVM> = {
  defaultVM: defaultMarkDownEditorDialogVM,
  subscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: MarkDownEditorDialogVM) => void
  ) => {
    const pm = MarkDownEditorDialogPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError(
        "markDownEditorDialogAdapters",
        "Unable to find PM"
      );
      return;
    }
    pm.addView(setVM);
  },
  unsubscribe: (
    id: string,
    appObjects: AppObjectRepo,
    setVM: (vm: MarkDownEditorDialogVM) => void
  ) => {
    const pm = MarkDownEditorDialogPM.get(id, appObjects);
    if (!pm) {
      appObjects.submitError(
        "markDownEditorDialogAdapters",
        "Unable to find PM"
      );
      return;
    }
    pm.removeView(setVM);
  }
};
