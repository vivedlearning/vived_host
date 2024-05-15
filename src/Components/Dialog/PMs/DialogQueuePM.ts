import { getSingletonComponent, HostAppObject, HostAppObjectPM, HostAppObjectRepo } from '../../../HostAppObject';
import { DialogQueue } from '../Entities';

export interface DialogVM {
  open: boolean;
  id?: string;
  dialogType?: string;
  preventOutsideDismiss?: boolean;
}

export class DialogQueuePM extends HostAppObjectPM<DialogVM> {
  static type = 'DialogQueuePM';

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<DialogQueuePM>(DialogQueuePM.type, appObjects);
  }

  private queue?: DialogQueue;

  vmsAreEqual(a: DialogVM, b: DialogVM): boolean {
    if (a.open !== b.open) return false;
    if (a.id !== b.id) return false;
    if (a.dialogType !== b.dialogType) return false;
    if (a.preventOutsideDismiss !== b.preventOutsideDismiss) return false;

    return true;
  }

  onQueueChange = () => {
    if (!this.queue) return;

    let vm: DialogVM = { open: false };

    const currentDialog = this.queue.activeDialog;

    if (currentDialog) {
      vm = {
        open: currentDialog.isOpen,
        dialogType: currentDialog.dialogType,
        preventOutsideDismiss: currentDialog.preventOutsideDismiss,
        id: currentDialog.appObject.id,
      };
    }

    this.doUpdateView(vm);
  };

  constructor(appObject: HostAppObject) {
    super(appObject, DialogQueuePM.type);

    this.queue = appObject.getComponent<DialogQueue>(DialogQueue.type);
    if (!this.queue) {
      this.error('PM added to an app object that does not have a DialogQueue');
      return;
    }

    this.queue.addChangeObserver(this.onQueueChange);
    this.onQueueChange();

    this.appObjects.registerSingleton(this);
  }
}

export const defualtDialogVM: DialogVM = {
  open: false,
};
