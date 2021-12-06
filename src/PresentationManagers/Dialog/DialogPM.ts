import { Dialog, DialogRepo } from "../..";

export interface DialogVM {
    showDialog: boolean;
    title: string | undefined;
    message: string;
    primaryActionText: string;
    secondaryActionText: string | undefined;
}

export class DialogPM {
    private dialogRepo: DialogRepo;
    private updateView: (viewModel: DialogVM) => void;

    dispose() {
        this.dialogRepo.removeObserver(this.doUpdateView);
    }

    private doUpdateView = (dialog: Dialog | undefined): void => {
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

    constructor(
      dialogRepo: DialogRepo,
        updateView: (viewMode: DialogVM) => void
    ) {
        this.dialogRepo = dialogRepo;
        this.updateView = updateView;
        this.doUpdateView(undefined);
        this.dialogRepo.addObserver(this.doUpdateView);
    }
}