import { HostAppObject, HostAppObjectPM, HostAppObjectRepo } from '../../../HostAppObject';
import { DialogSpinnerEntity } from '../Entities';

export interface SpinnerDialogVM {
  message: string;
  title: string;
}

export class SpinnerDialogPM extends HostAppObjectPM<SpinnerDialogVM> {
  static type = 'SpinnerDialogPM';

  static get(assetID: string, appObjects: HostAppObjectRepo): SpinnerDialogPM | undefined {
    const appObject = appObjects.get(assetID);
    if (!appObject) {
      appObjects.submitWarning('SpinnerDialogPM.get', 'Unable to find app object');
      return undefined;
    }

    const pm = appObject.getComponent<SpinnerDialogPM>(SpinnerDialogPM.type);
    if (!pm) {
      appObjects.submitWarning('SpinnerDialogPM.get', 'App Object does not have SpinnerDialogPM');
      return undefined;
    }

    return pm;
  }

  private dialog?: DialogSpinnerEntity;

  vmsAreEqual(a: SpinnerDialogVM, b: SpinnerDialogVM): boolean {
    if (a.message !== b.message) return false;
    if (a.title !== b.title) return false;

    return true;
  }

  onAlertChange = () => {
    if (!this.dialog) return;

    this.doUpdateView({
      message: this.dialog.message,
      title: this.dialog.title,
    });
  };

  constructor(appObject: HostAppObject) {
    super(appObject, SpinnerDialogPM.type);

    this.dialog = appObject.getComponent<DialogSpinnerEntity>(DialogSpinnerEntity.type);
    if (!this.dialog) {
      this.error('PM added to an app object that does not have a DialogSpinnerEntity');
      return;
    }

    this.dialog.addChangeObserver(this.onAlertChange);
    this.onAlertChange();
  }
}
