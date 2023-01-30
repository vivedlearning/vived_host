import { DialogRepo, DialogSpinner, spinnerDialogType } from "../../Entities";


export interface SpinnerDialogVM {
  message: string;
  title: string;
}

export class SpinnerDialogPM {
  private observingAlert: DialogSpinner | null = null;
  private lastVM?: SpinnerDialogVM | null;

  doUpdateView = () => {
    let vm: SpinnerDialogVM | null = null;

    if (
      this.repo.activeDialog &&
      this.repo.activeDialog.type === spinnerDialogType
    ) {
      const spinnerDialog = this.repo.activeDialog as DialogSpinner;

      this.updateAlertObserver(spinnerDialog);

      vm = {
        message: spinnerDialog.message,
        title: spinnerDialog.title,
      };
    } else {
      this.updateAlertObserver(null);
    }

    if (!this.vmHasChanged(vm)) return;

    this.updateView(vm);
    this.lastVM = vm;
  };

  updateAlertObserver(alert: DialogSpinner | null) {
    if (alert === this.observingAlert) return;

    if (this.observingAlert !== null) {
      this.observingAlert.removeObserver(this.doUpdateView);
    }

    if (alert !== null) {
      alert.addObserver(this.doUpdateView);
    }

    this.observingAlert = alert;
  }

  private vmHasChanged(vm: SpinnerDialogVM | null): boolean {
    if (this.lastVM === undefined) return true;

    if (vm === null && this.lastVM === null) return false;

    if (
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
    private updateView: (vm: SpinnerDialogVM | null) => void
  ) {
    repo.addObserver(this.doUpdateView);
    this.doUpdateView();
  }
}