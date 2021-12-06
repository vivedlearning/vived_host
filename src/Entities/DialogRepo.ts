import { ObserverList } from './ObserverList';

export interface DialogRepo {
  createDialog: (message: string, title?: string, primaryAction?: DialogAction, secondaryAction?: DialogAction) => void;
  getCurrentDialog: () => Dialog | undefined;
  callPrimaryDialogAction: () => void;
  callSecondaryDialogAction: () => void;
  addObserver: (observer: OnDialogChange) => void;
  removeObserver: (observer: OnDialogChange) => void;
}

export interface Dialog {
  title?: string;
  message: string;
  primaryAction: DialogAction;
  secondaryAction?: DialogAction;
}

export interface DialogAction {
  text: string;
  action?: () => void;
}

export type OnDialogChange = (dialog: Dialog | undefined) => void;

export function makeDialogRepo(): DialogRepo {
  return new DialogRepoImp();
}

class DialogRepoImp implements DialogRepo {
  private dialogQueue: Dialog[] = [];
  private observers = new ObserverList<Dialog | undefined>();

  createDialog = (
    message: string,
    title?: string | undefined,
    primaryAction?: DialogAction | undefined,
    secondaryAction?: DialogAction | undefined,
  ) => {
    const primaryActionToUse: DialogAction = primaryAction ?? { text: 'OK' };

    let dialog: Dialog = {
      message,
      primaryAction: primaryActionToUse,
    };

    if (title) {
      dialog = {
        ...dialog,
        title,
      };
    }

    if (secondaryAction) {
      dialog = {
        ...dialog,
        secondaryAction,
      };
    }

    this.dialogQueue.push(dialog);
    this.observers.notify(this.getCurrentDialog());
  };

  getCurrentDialog = (): Dialog | undefined => {
    return this.dialogQueue.length > 0 ? this.dialogQueue[0] : undefined;
  };

  callPrimaryDialogAction = () => {
    const activeDialog = this.getCurrentDialog();
    if (activeDialog) {
      if (activeDialog.primaryAction.action) {
        activeDialog.primaryAction.action();
      }
      this.dismissActiveDialog();
    }
  };

  callSecondaryDialogAction = () => {
    const activeDialog = this.getCurrentDialog();
    if (activeDialog) {
      if (activeDialog.secondaryAction?.action) {
        activeDialog.secondaryAction.action();
      }
      this.dismissActiveDialog();
    }
  };

  addObserver = (observer: OnDialogChange) => {
    this.observers.add(observer);
  };

  removeObserver = (observer: OnDialogChange) => {
    this.observers.remove(observer);
  };

  private dismissActiveDialog = () => {
    if (this.dialogQueue.length > 0) {
      this.dialogQueue.splice(0, 1);
      this.observers.notify(this.getCurrentDialog());
    }
  };
}
