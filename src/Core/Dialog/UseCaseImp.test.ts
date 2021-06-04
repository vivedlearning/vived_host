import { Dialog, DialogObserver, DialogUC } from "./boundary";
import { DialogUCImp } from "./UseCaseImp";

class MockObserver implements DialogObserver {
    lastDialog: Dialog | undefined;
    constructor() {
        this.lastDialog = undefined;
    }
    onDialogChange(dialog?: Dialog): void {
        this.lastDialog = dialog;
    }
}

function makeTestRig() {
    const useCase: DialogUC = new DialogUCImp();
    const observer = new MockObserver();
    useCase.addObserver(observer);
    return { useCase, observer };
}

test("Initial state", () => {
    const { useCase } = makeTestRig();
    expect(useCase.getCurrentDialog()).toEqual(undefined);
});

test("Making a dialog triggers the observer", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastDialog).toEqual(undefined);
    useCase.createDialog("testing");
    expect(observer.lastDialog?.message).toEqual("testing");
    expect(useCase.getCurrentDialog()?.message).toEqual("testing");
});

test("Observer can be removed", () => {
    const { useCase, observer } = makeTestRig();
    useCase.removeObserver(observer);
    useCase.createDialog("testing");
    expect(observer.lastDialog).toEqual(undefined);
});

test("Making a dialog with a title sets the title", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastDialog).toEqual(undefined);
    useCase.createDialog("testing", "TITLE");
    expect(useCase.getCurrentDialog()?.title).toEqual("TITLE");
    expect(useCase.getCurrentDialog()?.message).toEqual("testing");
});

test("Making a dialog without a primary action sets a default action button to OK", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastDialog).toEqual(undefined);
    useCase.createDialog("testing");
    expect(useCase.getCurrentDialog()?.primaryAction.text).toEqual("OK");
});

test("Making a dialog with a primary action sets action text", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastDialog).toEqual(undefined);
    useCase.createDialog("testing", undefined, { text: "PRIMARY" });
    expect(useCase.getCurrentDialog()?.primaryAction.text).toEqual("PRIMARY");
});

test("Making a dialog with a secondary action sets secondary action text", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastDialog).toEqual(undefined);
    useCase.createDialog("testing", undefined, undefined, { text: "SECONDARY" });
    expect(useCase.getCurrentDialog()?.secondaryAction?.text).toEqual("SECONDARY");
});

test("Primary action can be called and dialog dismissed", () => {
    const { useCase, observer } = makeTestRig();
    const actionFunction = jest.fn();
    useCase.createDialog("testing", "title", {
        action: actionFunction,
        text: "action text"
    });
    useCase.callPrimaryDialogAction();
    expect(actionFunction).toHaveBeenCalled();
    expect(observer.lastDialog).toBeUndefined();
});

test("Secondary action can be called and dialog dismissed", () => {
    const { useCase, observer } = makeTestRig();
    const actionFunction = jest.fn();
    useCase.createDialog("testing", "title", undefined, {
        action: actionFunction,
        text: "action text"
    });
    useCase.callSecondaryDialogAction();
    expect(actionFunction).toHaveBeenCalled();
    expect(observer.lastDialog).toBeUndefined();
});

test("Primary and secondary actions without action functions can still be dismissed", () => {
    const { useCase, observer } = makeTestRig();
    useCase.createDialog("testing", "title", {
        text: "action text"
    });
    useCase.callPrimaryDialogAction();
    expect(observer.lastDialog).toBeUndefined();

    useCase.createDialog("testing", "title", undefined, {
        text: "action text"
    });
    useCase.callSecondaryDialogAction();
    expect(observer.lastDialog).toBeUndefined();
});

test("Dialogs can be queded up and the queue empties as they are dismissed", ()=>{
    const { useCase, observer } = makeTestRig();
    useCase.createDialog("test 1", "title");  
    useCase.createDialog("test 2", "title", undefined, {
        text: "secondary text"
    });

    expect(observer.lastDialog?.message).toEqual("test 1");
    useCase.callPrimaryDialogAction();
    expect(observer.lastDialog?.message).toEqual("test 2");
    useCase.callSecondaryDialogAction();
    expect(observer.lastDialog).toBeUndefined();
});