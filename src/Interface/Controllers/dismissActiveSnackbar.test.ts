
import { SnackbarUCImp } from "../../Core/Snackbar/UseCaseImp";
import { makeDismissActiveSnackbar } from "./dismissActiveSnackbar";

test("Dismissing the active snackbar", () => {
    const snackbarUC = new SnackbarUCImp();
    const dismissActiveSnackbar = makeDismissActiveSnackbar(snackbarUC);

    const actionFunction = jest.fn();
    snackbarUC.makeSnackbar("testing");
    dismissActiveSnackbar();
    expect(snackbarUC.getCurrentSnackbar()).toBeUndefined();
});