import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from '../../../HostAppObject';
import { DialogAlertDTO, DialogAlertEntity } from './DialogAlert';
import { DialogConfirmDTO, DialogConfirmEntity } from './DialogConfirm';
import { DialogMarkDownEditorDTO, DialogMarkDownEntity } from './DialogMarkDownEditor';
import { DialogSpinnerDTO, DialogSpinnerEntity } from './DialogSpinner';

export abstract class Dialog extends HostAppObjectEntity {
  abstract dialogType: string;
  abstract preventOutsideDismiss: boolean;
  abstract isOpen: boolean;
}

export abstract class DialogQueue extends HostAppObjectEntity {
  static type = 'DialogQueue';

  abstract get activeDialog(): Dialog | null;
  abstract submitDialog(dialog: Dialog): void;
  abstract activeDialogHasClosed(): void;

  abstract alertDialogFactory(dto: DialogAlertDTO): DialogAlertEntity | undefined;
  abstract confirmDialogFactory(dto: DialogConfirmDTO): DialogConfirmEntity | undefined;
  abstract markDownDialogFactory(dto: DialogMarkDownEditorDTO): DialogMarkDownEntity | undefined;
  abstract spinnerDialogFactory(dto: DialogSpinnerDTO): DialogSpinnerEntity | undefined;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<DialogQueue>(DialogQueue.type, appObjects);
  }
}

export function makeDialogQueue(appObject: HostAppObject): DialogQueue {
  return new DialogRepoImp(appObject);
}

class DialogRepoImp extends DialogQueue {
  private dialogQueue: Dialog[] = [];

  get activeDialog(): Dialog | null {
    return this.dialogQueue.length > 0 ? this.dialogQueue[0] : null;
  }

  submitDialog = (dialog: Dialog): void => {
    this.dialogQueue.push(dialog);

    if (this.activeDialog === dialog) {
      dialog.isOpen = true;
    }

    dialog.addChangeObserver(this.notifyOnChange);

    this.notifyOnChange();
  };

  activeDialogHasClosed = (): void => {
    const activeDialog = this.activeDialog;
    if (activeDialog !== null) {
      this.dialogQueue.splice(0, 1);

      const newActiveDialog = this.activeDialog;
      if (newActiveDialog !== null) {
        newActiveDialog.isOpen = true;
      }

      activeDialog.removeChangeObserver(this.notifyOnChange);

      this.notifyOnChange();
    }
  };

  alertDialogFactory = (dto: DialogAlertDTO): DialogAlertEntity | undefined => {
    this.error('Alert factory has not been injected');
    return;
  };
  confirmDialogFactory = (dto: DialogConfirmDTO): DialogConfirmEntity | undefined => {
    this.error('Confirm factory has not been injected');
    return;
  };
  markDownDialogFactory = (dto: DialogMarkDownEditorDTO): DialogMarkDownEntity | undefined => {
    this.error('Mark Down factory has not been injected');
    return;
  };
  spinnerDialogFactory = (dto: DialogSpinnerDTO): DialogSpinnerEntity | undefined => {
    this.error('Spinner factory has not been injected');
    return;
  };

  constructor(appObject: HostAppObject) {
    super(appObject, DialogQueue.type);
    this.appObjects.registerSingleton(this);
  }
}
