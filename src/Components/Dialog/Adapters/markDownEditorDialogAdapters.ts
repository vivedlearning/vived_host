import { HostAppObjectRepo } from "../../../HostAppObject";
import { PmAdapter } from "../../../Types/PmAdapter";
import {
  MarkDownEditorDialogVM,
  MarkDownEditorDialogPM,
  defaultMarkDownEditorDialogVM
} from "../PMs";

export const markDownEditorDialogAdapters: PmAdapter<MarkDownEditorDialogVM> = {
  defaultVM: defaultMarkDownEditorDialogVM,
  subscribe: (
    id: string,
    appObjects: HostAppObjectRepo,
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
    appObjects: HostAppObjectRepo,
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
