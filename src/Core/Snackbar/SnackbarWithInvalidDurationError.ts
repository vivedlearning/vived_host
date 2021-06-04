export class SnackbarWithInvalidDurationError extends Error {
    constructor(duration: number) {
        const msg = `${duration} is an invalid duration for a Snackbar`;
        super(msg);
    }
}