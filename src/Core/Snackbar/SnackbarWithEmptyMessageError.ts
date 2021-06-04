export class SnackbarWithEmptyMessageError extends Error {
    constructor() {
        const msg = "Snackbar must have a message";
        super(msg);
    }
}