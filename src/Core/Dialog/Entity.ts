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