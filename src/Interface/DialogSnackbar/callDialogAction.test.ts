import { DialogUCImp } from "../../Core/Dialog/UseCaseImp";
import { makeCallDialogAction } from "./callDialogAction";

test("Calling the primary action", () => {
    const dialogUC = new DialogUCImp();
    const callDialogAction = makeCallDialogAction(dialogUC);

    const actionFunction = jest.fn();
    dialogUC.createDialog("testing", undefined, {
        action: actionFunction,
        text: "action text"
    });
    
    callDialogAction("PRIMARY");
    expect(actionFunction).toHaveBeenCalled();
});

test("Calling the secondary action", () => {
    const dialogUC = new DialogUCImp();
    const callDialogAction = makeCallDialogAction(dialogUC);

    const actionFunction = jest.fn();
    dialogUC.createDialog("testing", undefined, {
        text: "primary"
    }, {
        action: actionFunction,
        text: "secondary"
    });

    callDialogAction("SECONDARY");
    expect(actionFunction).toHaveBeenCalled();
});