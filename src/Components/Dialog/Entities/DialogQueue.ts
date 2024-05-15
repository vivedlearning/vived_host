import { getSingletonComponent, HostAppObject, HostAppObjectEntity, HostAppObjectRepo } from '../../../HostAppObject';
import { DialogAlertDTO, AlertDialogEntity } from './Alert';
import { DialogConfirmDTO, ConfirmDialogEntity } from './Confirm';
import { DialogMarkDownEditorDTO, MarkDownEditorDialogEntity } from './MarkDownEditor';
import { SelectModelDialogEntity } from './SelectModel';
import { DialogSpinnerDTO, SpinnerDialogEntity } from './Spinner';

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

  abstract alertDialogFactory(dto: DialogAlertDTO): AlertDialogEntity | undefined;
  abstract confirmDialogFactory(dto: DialogConfirmDTO): ConfirmDialogEntity | undefined;
  abstract markDownDialogFactory(dto: DialogMarkDownEditorDTO): MarkDownEditorDialogEntity | undefined;
  abstract selectModelDialogFactory(): SelectModelDialogEntity | undefined;
  abstract spinnerDialogFactory(dto: DialogSpinnerDTO): SpinnerDialogEntity | undefined;

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

  alertDialogFactory = (dto: DialogAlertDTO): AlertDialogEntity | undefined => {
    this.error('Alert factory has not been injected');
    return;
  };

  confirmDialogFactory = (dto: DialogConfirmDTO): ConfirmDialogEntity | undefined => {
    this.error('Confirm factory has not been injected');
    return;
  };

  markDownDialogFactory = (dto: DialogMarkDownEditorDTO): MarkDownEditorDialogEntity | undefined => {
    this.error('Mark Down factory has not been injected');
    return;
  };

  selectModelDialogFactory(): SelectModelDialogEntity | undefined {
    this.error('Select Model factory has not been injected');
    return;
  }

  spinnerDialogFactory = (dto: DialogSpinnerDTO): SpinnerDialogEntity | undefined => {
    this.error('Spinner factory has not been injected');
    return;
  };

  constructor(appObject: HostAppObject) {
    super(appObject, DialogQueue.type);
    this.appObjects.registerSingleton(this);
  }
}
