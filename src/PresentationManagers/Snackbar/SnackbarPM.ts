import { Snackbar, SnackbarRepo } from "../../Entities";

export interface SnackbarVM {
    message: string | undefined;
    durationInSeconds: number;
    actionButtonText: string | undefined;
}

export class SnackbarPM {
    private snackbarRepo: SnackbarRepo;
    private updateView: (viewModel: SnackbarVM) => void;

    

    dispose() {
        this.snackbarRepo.removeObserver(this.doUpdateView);
    }

    private doUpdateView = (snackbar: Snackbar | undefined): void => {
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

    constructor(
      snackbarUC: SnackbarRepo,
      updateView: (viewMode: SnackbarVM) => void
  ) {
      this.snackbarRepo = snackbarUC;
      this.updateView = updateView;
      this.doUpdateView(undefined);
      this.snackbarRepo.addObserver(this.doUpdateView);
  }    

}