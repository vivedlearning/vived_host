import { SnackbarObserver, SnackbarUC } from "../../Core/Snackbar";
import { Snackbar } from "../../Core/Snackbar/Entity";


export interface SnackbarVM {
    message: string | undefined;
    durationInSeconds: number;
    actionButtonText: string | undefined;
}

export class SnackbarPM implements SnackbarObserver {
    private snackbarUC: SnackbarUC;
    private updateView: (viewModel: SnackbarVM) => void;

    constructor(
        snackbarUC: SnackbarUC,
        updateView: (viewMode: SnackbarVM) => void
    ) {
        this.snackbarUC = snackbarUC;
        this.updateView = updateView;
        this.doUpdateView(undefined);
        this.snackbarUC.addObserver(this);
    }    

    dispose() {
        this.snackbarUC.removeObserver(this);
    }

    private doUpdateView(snackbar: Snackbar | undefined): void {
        let model: SnackbarVM = {
            message: undefined,
            durationInSeconds: 0,
            actionButtonText: undefined
        }

        if (snackbar) {
            model = {
                message: snackbar.message,
                durationInSeconds: snackbar.durationInSeconds,
                actionButtonText: snackbar.snackbarAction?snackbar.snackbarAction.actionButtonText:undefined
            }
        }
        
        this.updateView(model);
    }

    onSnackbarChange(snackbar: Snackbar | undefined): void {
        this.doUpdateView(snackbar);
    }

}