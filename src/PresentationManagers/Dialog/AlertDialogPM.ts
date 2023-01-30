import { alertDialogType, DialogAlert, DialogRepo } from "../../Entities";


export interface AlertDialogVM {
  message: string;
  title: string;
  buttonLabel: string;
  close: () => void;
}

export class AlertDialogPM {
  private observingAlert: DialogAlert | null = null;
  private lastVM?: AlertDialogVM | null;

  doUpdateView = () => {
    let vm: AlertDialogVM | null = null;

    if (
      this.repo.activeDialog &&
      this.repo.activeDialog.type === alertDialogType
    ) {
      const alertDialog = this.repo.activeDialog as DialogAlert;

      this.updateAlertObserver(alertDialog);

      vm = {
        buttonLabel: alertDialog.buttonLabel,
        close: alertDialog.close,
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

  updateAlertObserver(alert: DialogAlert | null) {
    if (alert === this.observingAlert) return;

    if (this.observingAlert !== null) {
      this.observingAlert.removeObserver(this.doUpdateView);
    }

    if (alert !== null) {
      alert.addObserver(this.doUpdateView);
    }

    this.observingAlert = alert;
  }

  private vmHasChanged(vm: AlertDialogVM | null): boolean {
    if (this.lastVM === undefined) return true;

    if (vm === null && this.lastVM === null) return false;

    if (
      vm?.buttonLabel === this.lastVM?.buttonLabel &&
      vm?.message === this.lastVM?.message &&
      vm?.title === this.lastVM?.title
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
    private updateView: (vm: AlertDialogVM | null) => void
  ) {
    repo.addObserver(this.doUpdateView);
    this.doUpdateView();
  }
}