import { DialogUC } from "../../Core/Dialog";

export function makeCallDialogAction(dialogUC: DialogUC) {
    return function callDialogAction(action: "PRIMARY" | "SECONDARY") {
        if (action === "PRIMARY") {
            dialogUC.callPrimaryDialogAction();
        }
        else{
            dialogUC.callSecondaryDialogAction();
        }
    }
}