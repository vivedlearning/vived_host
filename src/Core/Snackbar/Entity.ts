export interface Snackbar {
    message: string;
    durationInSeconds: number;
    snackbarAction?: SnackbarAction;
}

export interface SnackbarAction {
    actionButtonText: string;
    action: () => void;
}