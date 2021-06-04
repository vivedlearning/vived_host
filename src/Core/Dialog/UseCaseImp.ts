import * as BOUNDARY from "./boundary";
import * as ENTITIES from "./Entity";

export class DialogUCImp implements BOUNDARY.DialogUC {
    private dialogQueue: ENTITIES.Dialog[];
    private observers: BOUNDARY.DialogObserver[] = [];

    constructor() {
        this.dialogQueue = [];
    }

    createDialog = (message: string, title?: string | undefined, primaryAction?: BOUNDARY.DialogAction | undefined, secondaryAction?: BOUNDARY.DialogAction | undefined) => {
        const primaryActionToUse: BOUNDARY.DialogAction = primaryAction ?? { text: "OK" };

        let dialog: ENTITIES.Dialog = {
            message,
            primaryAction: primaryActionToUse
        }

        if (title) {
            dialog = {
                ...dialog,
                title
            }
        }

        if (secondaryAction) {
            dialog = {
                ...dialog,
                secondaryAction
            }
        }

        this.dialogQueue.push(dialog);
        this.notifyObservers();
    }

    getCurrentDialog = (): BOUNDARY.Dialog | undefined => {
        return this.dialogQueue.length > 0 ? this.dialogQueue[0] : undefined
    }

    callPrimaryDialogAction = () => {
        const activeDialog = this.getCurrentDialog();
        if (activeDialog) {
            if (activeDialog.primaryAction.action) {
                activeDialog.primaryAction.action();
            }
            this.dismissActiveDialog();
        }
    }

    callSecondaryDialogAction = () => {
        const activeDialog = this.getCurrentDialog();
        if (activeDialog) {
            if (activeDialog.secondaryAction?.action) {
                activeDialog.secondaryAction.action();
            }
            this.dismissActiveDialog();
        }
    }

    addObserver = (observer: BOUNDARY.DialogObserver) => {
        this.observers.push(observer);
    }

    removeObserver = (observer: BOUNDARY.DialogObserver) => {
        const index = this.observers.indexOf(observer);
        if (index >= 0) {
            this.observers.splice(index, 1);
        }
    }

    private dismissActiveDialog = () => {
        if (this.dialogQueue.length > 0) {
            this.dialogQueue.splice(0, 1);
            this.notifyObservers();
        }
    }

    private notifyObservers() {
        this.observers.forEach((obs) => obs.onDialogChange(this.getCurrentDialog()));
    }

}