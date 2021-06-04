import { DialogUCImp } from "../../Core/Dialog/UseCaseImp";
import { DialogPM, DialogVM } from "./DialogPM";

function viewCallbackCount(view: jest.Mock<any, any>): number {
    return view.mock.calls.length;
}

function getLastModel(view: jest.Mock<any, any>): DialogVM | undefined {
    const cnt = viewCallbackCount(view);
    if (cnt > 0) {
        return view.mock.calls[cnt - 1][0];
    } else {
        return undefined;
    }
}

function makeTestRig() {
    const dialogUC = new DialogUCImp();
    const view = jest.fn();
    const pm = new DialogPM(dialogUC, view);
    return { dialogUC, pm, view };
}

test("PM initializes", () => {
    const { view } = makeTestRig();
    const callbackCount = viewCallbackCount(view);
    const lastVM = getLastModel(view);
    expect(callbackCount).toEqual(1);
    expect(lastVM?.showDialog).toEqual(false);
});

test("PM updates when use case changes", () => {
    const { dialogUC, view } = makeTestRig();
    dialogUC.createDialog("test");
    const lastVM = getLastModel(view);
    expect(lastVM?.message).toEqual("test");
});

test("View notified of a change", () => {
    const { dialogUC, view } = makeTestRig();
    dialogUC.createDialog("test");
    const callbackCount = viewCallbackCount(view)
    expect(callbackCount).toEqual(2);
});

test("PM disposes", () => {
    const { dialogUC, pm, view } = makeTestRig();
    pm.dispose();
    dialogUC.createDialog("test");
    const lastVM = getLastModel(view);
    expect(lastVM?.showDialog).toEqual(false);
});

test("All possible values set correctly in the VM", ()=> {
    const { dialogUC, view } = makeTestRig();
    dialogUC.createDialog("test message", "test title", {text: "primary text"}, {text: "secondary text"});
    const lastVM = getLastModel(view);
    expect(lastVM?.showDialog).toEqual(true);
    expect(lastVM?.message).toEqual("test message");
    expect(lastVM?.title).toEqual("test title");
    expect(lastVM?.primaryActionText).toEqual("primary text");
    expect(lastVM?.secondaryActionText).toEqual("secondary text");
});