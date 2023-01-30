import { DialogBase, DialogRepo } from "../../Entities";


export interface DialogVM {
  open: boolean;
  type?: string;
  dialog?: DialogBase;
  preventOutsideDismiss?: boolean
}

export class DialogPM {
  private observingDialog: DialogBase | null = null;
  private lastVM?: DialogVM;

  doUpdateView = () => {
    let vm: DialogVM = {open: false};

    const currentDialog = this.repo.activeDialog;

    if (
      currentDialog
    ) {
      this.updateAlertObserver(currentDialog);

      vm = {
        open: currentDialog.isOpen,
        type: currentDialog.type,
        dialog: currentDialog ,
        preventOutsideDismiss: currentDialog.preventOutsideDismiss
      };
    } else {
      this.updateAlertObserver(null);
    }

    if (!this.vmHasChanged(vm)) return;

    this.updateView(vm);
    this.lastVM = vm;
  };

  updateAlertObserver(alert: DialogBase | null) {
    if (alert === this.observingDialog) return;

    if (this.observingDialog !== null) {
      this.observingDialog.removeObserver(this.doUpdateView);
    }

    if (alert !== null) {
      alert.addObserver(this.doUpdateView);
    }

    this.observingDialog = alert;
  }

  private vmHasChanged(vm: DialogVM | null): boolean {
    if (this.lastVM === undefined) return true;

    if (vm === null && this.lastVM === null) return false;

    if (
      vm?.open === this.lastVM?.open &&
      vm?.type === this.lastVM?.type &&
      vm?.dialog === this.lastVM?.dialog
    ) {
      return false;
    }

    return true;
  }

  dispose = () => {
    this.repo.removeObserver(this.doUpdateView);
    if (this.observingDialog) {
      this.observingDialog.removeObserver(this.doUpdateView);
    }
  };

  constructor(
    private repo: DialogRepo,
    private updateView: (vm: DialogVM) => void
  ) {
    repo.addObserver(this.doUpdateView);
    this.doUpdateView();
  }
}

export const defualtDialogVM: DialogVM = {
  open: false
};

