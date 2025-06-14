import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { DialogQueue } from "../Entities";

export interface DialogQueueVM {
  open: boolean;
  id?: string;
  dialogType?: string;
  preventOutsideDismiss?: boolean;
}

export abstract class DialogQueuePM extends AppObjectPM<DialogQueueVM> {
  static type = "DialogQueuePM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<DialogQueuePM>(DialogQueuePM.type, appObjects);
  }
}

export function makeDialogQueuePM(appObject: AppObject): DialogQueuePM {
  return new DialogQueuePMImp(appObject);
}

class DialogQueuePMImp extends DialogQueuePM {
  private queue?: DialogQueue;

  vmsAreEqual(a: DialogQueueVM, b: DialogQueueVM): boolean {
    if (a.open !== b.open) return false;
    if (a.id !== b.id) return false;
    if (a.dialogType !== b.dialogType) return false;
    if (a.preventOutsideDismiss !== b.preventOutsideDismiss) return false;

    return true;
  }

  onQueueChange = () => {
    if (!this.queue) return;

    let vm: DialogQueueVM = { open: false };

    const currentDialog = this.queue.activeDialog;

    if (currentDialog) {
      vm = {
        open: currentDialog.isOpen,
        dialogType: currentDialog.dialogType,
        preventOutsideDismiss: currentDialog.preventOutsideDismiss,
        id: currentDialog.appObject.id
      };
    }

    this.doUpdateView(vm);
  };

  constructor(appObject: AppObject) {
    super(appObject, DialogQueuePM.type);

    this.queue = appObject.getComponent<DialogQueue>(DialogQueue.type);
    if (!this.queue) {
      this.error("PM added to an app object that does not have a DialogQueue");
      return;
    }

    this.queue.addChangeObserver(this.onQueueChange);
    this.onQueueChange();

    this.appObjects.registerSingleton(this);
  }
}

export const defaultDialogVM: DialogQueueVM = {
  open: false
};
