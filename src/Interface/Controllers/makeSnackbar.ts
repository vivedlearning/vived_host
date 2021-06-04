import { SnackbarUC } from "../../Core/Snackbar";
import { SnackbarAction } from "../../Core/Snackbar/Entity";

export function makeMakeSnackbar(snackbarUC: SnackbarUC){
    return function makeSnackbar(message: string, snackbarAction?: SnackbarAction, durationInSeconds?: number){
        snackbarUC.makeSnackbar(message, snackbarAction, durationInSeconds);
    }
}