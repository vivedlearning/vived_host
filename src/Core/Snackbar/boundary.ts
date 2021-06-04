export interface SnackbarUC {
    makeSnackbar: (message: string, snackbarAction?: SnackbarAction, durationInSeconds?: number) => void;
    getCurrentSnackbar: () => Snackbar | undefined;
    dismissActiveSnackbar: () => void;
    callActiveSnackbarAction: () => void;
    addObserver: (observer: SnackbarObserver) => void;
    removeObserver: (observer: SnackbarObserver) => void;
}

export interface Snackbar {
    message: string;
    durationInSeconds: number;
    snackbarAction?: SnackbarAction;
}

export interface SnackbarAction {
    actionButtonText: string;
    action: () => void;
}

export interface SnackbarObserver {
    onSnackbarChange(snackbar: Snackbar|undefined):void
}