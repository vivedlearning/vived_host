export class SnackbarWithEmptyActionButtonTextError extends Error {
  constructor() {
    const msg =
      "If a Snackbar has an action then the action button text cannot be empty";
    super(msg);
  }
}