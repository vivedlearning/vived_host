import { DialogAction, DialogUC } from "../../Core/Dialog";

export function makeCreateDialog(dialogUC: DialogUC) {
    return function createDialog(message: string, title?: string, primaryAction?: DialogAction, secondaryAction?: DialogAction) {
        dialogUC.createDialog(message, title, primaryAction, secondaryAction);
    }
}