import { DialogObserver, DialogUC } from "../../Core/Dialog";
import { Dialog } from "../../Core/Dialog/Entity";


export interface DialogVM {
    showDialog: boolean;
    title: string | undefined;
    message: string;
    primaryActionText: string;
    secondaryActionText: string | undefined;
}

export class DialogPM implements DialogObserver {
    private dialogUC: DialogUC;
    private updateView: (viewModel: DialogVM) => void;

    constructor(
        dialogUC: DialogUC,
        updateView: (viewMode: DialogVM) => void
    ) {
        this.dialogUC = dialogUC;
        this.updateView = updateView;
        this.doUpdateView(undefined);
        this.dialogUC.addObserver(this);
    }

    dispose() {
        this.dialogUC.removeObserver(this);
    }

    onDialogChange(dialog: Dialog | undefined): void {
        this.doUpdateView(dialog);
    }

    private doUpdateView(dialog: Dialog | undefined): void {
        let model: DialogVM = {
            showDialog: false,
            title: undefined,
            message: "",
            primaryActionText: "",
            secondaryActionText: undefined
        }

        if (dialog) {
            model = {
                showDialog: true,
                title: dialog.title ?? undefined,
                message: dialog.message,
                primaryActionText: dialog.primaryAction.text,
                secondaryActionText: dialog.secondaryAction ? dialog.secondaryAction.text : undefined
            }
        }

        this.updateView(model);
    }
}