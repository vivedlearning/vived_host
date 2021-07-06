import { SnackbarUCImp } from "../../Core/Snackbar/UseCaseImp";
import { makeCallActiveSnackbarAction } from "./callActiveSnackbarAction";

test("Calling the active action", () => {
    const snackbarUC = new SnackbarUCImp();
    const callActiveSnackbarAction = makeCallActiveSnackbarAction(snackbarUC);

    const actionFunction = jest.fn();
    snackbarUC.makeSnackbar("testing", {
        action: actionFunction,
        actionButtonText: "action text"
    });
    callActiveSnackbarAction();
    expect(actionFunction).toHaveBeenCalled();
});