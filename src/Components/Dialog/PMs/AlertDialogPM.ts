import { HostAppObject, HostAppObjectPM, HostAppObjectRepo } from '../../../HostAppObject';
import { AlertDialogEntity } from '../Entities';

export interface AlertDialogVM {
  message: string;
  title: string;
  buttonLabel: string;
  close: () => void;
}

export class AlertDialogPM extends HostAppObjectPM<AlertDialogVM> {
  static type = 'AlertDialogPM';

  static get(assetID: string, appObjects: HostAppObjectRepo): AlertDialogPM | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning('AlertDialogPM.get', 'Unable to find app object');
      return undefined;
    }

    const pm = appObject.getComponent<AlertDialogPM>(AlertDialogPM.type);
    if (!pm) {
      appObjects.submitWarning('AlertDialogPM.get', 'App Object does not have AlertDialogPM');
      return undefined;
    }

    return pm;
  }

  private alert?: AlertDialogEntity;

  vmsAreEqual(a: AlertDialogVM, b: AlertDialogVM): boolean {
    if (a.message !== b.message) return false;
    if (a.title !== b.title) return false;
    if (a.buttonLabel !== b.buttonLabel) return false;

    return true;
  }

  onAlertChange = () => {
    if (!this.alert) return;

    this.doUpdateView({
      buttonLabel: this.alert.buttonLabel,
      close: this.alert.close,
      message: this.alert.message,
      title: this.alert.title,
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, AlertDialogPM.type);

    this.alert = appObject.getComponent<AlertDialogEntity>(AlertDialogEntity.type);
    if (!this.alert) {
      this.error('PM added to an app object that does not have a DialogAlertEntity');
      return;
    }

    this.alert.addChangeObserver(this.onAlertChange);
    this.onAlertChange();
  }
}

export const defaultAlertDialogVM: AlertDialogVM = {
  message: "Generic alert message",
  title: "Alert",
  buttonLabel: "Close",
  close: () => {
    console.warn('[AlertDialogVM.close] default VM');
  }
}