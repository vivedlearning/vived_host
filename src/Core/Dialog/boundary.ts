export interface DialogUC {
    createDialog: (message: string, title?: string, primaryAction?: DialogAction, secondaryAction?: DialogAction) => void;
    getCurrentDialog: () => Dialog | undefined;
    callPrimaryDialogAction: () => void;
    callSecondaryDialogAction: () => void;
    addObserver: (observer: DialogObserver) => void;
    removeObserver: (observer: DialogObserver) => void;
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

export interface DialogObserver {
    onDialogChange(dialog: Dialog | undefined): void
}