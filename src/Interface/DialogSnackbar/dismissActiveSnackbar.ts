import { SnackbarUC } from "../../Core/Snackbar";

export function makeDismissActiveSnackbar(snackbarUC: SnackbarUC){
    return function dismissActiveSnackbar(){
        snackbarUC.dismissActiveSnackbar();
    }
}