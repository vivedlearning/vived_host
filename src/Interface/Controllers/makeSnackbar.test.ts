
import { SnackbarUCImp } from "../../Core/Snackbar/UseCaseImp";
import { makeMakeSnackbar } from "./makeSnackbar";

function makeTestRig() {
    const snackbarUC = new SnackbarUCImp();
    const makeSnackbar = makeMakeSnackbar(snackbarUC);
    return { snackbarUC, makeSnackbar };
}

test("Make snackbar", ()=>{
    const { snackbarUC, makeSnackbar} = makeTestRig();
    expect(snackbarUC.getCurrentSnackbar()).toBeUndefined();
    makeSnackbar("test");
    expect(snackbarUC.getCurrentSnackbar()?.message).toEqual("test");
});