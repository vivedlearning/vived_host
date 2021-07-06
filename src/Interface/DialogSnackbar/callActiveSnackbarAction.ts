import { SnackbarUC } from "../../Core/Snackbar";

export function makeCallActiveSnackbarAction(snackbarUC: SnackbarUC){
    return function callActiveSnackbarAction(){
        snackbarUC.callActiveSnackbarAction();
    }
}