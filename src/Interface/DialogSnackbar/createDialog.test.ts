import { DialogUCImp } from "../../Core/Dialog/UseCaseImp";
import { makeCreateDialog } from "./createDialog";

function makeTestRig() {
    const dialogUC = new DialogUCImp();
    const createDialog = makeCreateDialog(dialogUC);
    return { dialogUC, createDialog };
}

test("Create dialog", ()=>{
    const { dialogUC, createDialog} = makeTestRig();
    expect(dialogUC.getCurrentDialog()).toBeUndefined();
    createDialog("test");
    expect(dialogUC.getCurrentDialog()?.message).toEqual("test");
});