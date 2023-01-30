import { DialogBase } from "./DialogBase";
import { ObservableEntity } from "./ObservableEntity";

export abstract class DialogRepo extends ObservableEntity {
  abstract get activeDialog(): DialogBase | null;
  abstract submitDialog(dialog: DialogBase): void;
  abstract activeDialogHasClosed(): void;
}

export function makeDialogRepo(): DialogRepo {
  return new DialogRepoImp();
}

class DialogRepoImp extends DialogRepo {
  private dialogQueue: DialogBase[] = [];

  get activeDialog(): DialogBase | null {
    return this.dialogQueue.length > 0 ? this.dialogQueue[0] : null;
  }

  submitDialog(dialog: DialogBase): void {
    this.dialogQueue.push(dialog);

    if (this.activeDialog === dialog) {
      dialog.isOpen = true;
    }

    this.notify();
  }

  activeDialogHasClosed(): void {
    const activeDialog = this.activeDialog;
    if (activeDialog !== null) {
      this.dialogQueue.splice(0, 1);

      const newActiveDialog = this.activeDialog;
      if (newActiveDialog !== null) {
        newActiveDialog.isOpen = true;
      }

      this.notify();
    }
  }
}
