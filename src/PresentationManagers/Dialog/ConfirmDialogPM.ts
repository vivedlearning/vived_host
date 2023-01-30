import { confirmDialogType, DialogConfirm, DialogRepo } from "../../Entities";


export interface ConfirmDialogVM {
  message: string;
  title: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  cancel: () => void;
  confirm: () => void;
}

export class ConfirmDialogPM {
  private observingAlert: DialogConfirm | null = null;
  private lastVM?: ConfirmDialogVM;

  doUpdateView = () => {
    let vm: ConfirmDialogVM = {
      message: "",
      title: "",
      cancel: ()=>{
        console.warn("[ConfirmDialogVM.cancel] empty VM!")
      },
      cancelButtonLabel: "",
      confirm: ()=>{
        console.warn("[ConfirmDialogVM.confirm] empty VM!")
      },
      confirmButtonLabel: ""
    };

    if (
      this.repo.activeDialog &&
      this.repo.activeDialog.type === confirmDialogType
    ) {
      const alertDialog = this.repo.activeDialog as DialogConfirm;

      this.updateAlertObserver(alertDialog);

      vm = {
        cancelButtonLabel: alertDialog.cancelButtonLabel,
        confirmButtonLabel: alertDialog.confirmButtonLabel,
        cancel: alertDialog.cancel,
        confirm: alertDialog.confirm,
        message: alertDialog.message,
        title: alertDialog.title,
      };
    } else {
      this.updateAlertObserver(null);
    }

    if (!this.vmHasChanged(vm)) return;

    this.updateView(vm);
    this.lastVM = vm;
  };

  updateAlertObserver(alert: DialogConfirm | null) {
    if (alert === this.observingAlert) return;

    if (this.observingAlert !== null) {
      this.observingAlert.removeObserver(this.doUpdateView);
    }

    if (alert !== null) {
      alert.addObserver(this.doUpdateView);
    }

    this.observingAlert = alert;
  }

  private vmHasChanged(vm: ConfirmDialogVM): boolean {
    if (this.lastVM === undefined) return true;
    if (
      vm.cancelButtonLabel === this.lastVM.cancelButtonLabel &&
      vm.message === this.lastVM.message &&
      vm.title === this.lastVM.title
    ) {
      return false;
    }

    return true;
  }

  dispose = () => {
    this.repo.removeObserver(this.doUpdateView);
    if (this.observingAlert) {
      this.observingAlert.removeObserver(this.doUpdateView);
    }
  };

  constructor(
    private repo: DialogRepo,
    private updateView: (vm: ConfirmDialogVM) => void
  ) {
    repo.addObserver(this.doUpdateView);
    this.doUpdateView();
  }
}

export const defaultConfirmDialogVM: ConfirmDialogVM = {
  message: "",
  title: "",
  cancel: ()=>{
    console.warn("[ConfirmDialogVM.cancel] default VM!")
  },
  cancelButtonLabel: "",
  confirm: ()=>{
    console.warn("[ConfirmDialogVM.confirm] default VM!")
  },
  confirmButtonLabel: ""
};