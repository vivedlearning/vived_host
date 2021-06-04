import { Snackbar, SnackbarAction, SnackbarObserver, SnackbarUC } from "./boundary";
import { SnackbarWithEmptyActionButtonTextError } from "./SnackbarWithEmptyActionButtonTextError";
import { SnackbarWithInvalidDurationError } from "./SnackbarWithInvalidDurationError";
import { SnackbarWithEmptyMessageError } from "./SnackbarWithEmptyMessageError";
import { SnackbarUCImp } from "./UseCaseImp";

class MockObserver implements SnackbarObserver {
    lastSnackbar: Snackbar | undefined;
    constructor() {
        this.lastSnackbar = undefined;
    }
    onSnackbarChange(snackbar?: Snackbar): void {
        this.lastSnackbar = snackbar;
    }
}

function makeTestRig() {
    const useCase: SnackbarUC = new SnackbarUCImp();
    const observer = new MockObserver();
    useCase.addObserver(observer);
    return { useCase, observer };
}

test("Initial state", () => {
    const { useCase } = makeTestRig();
    expect(useCase.getCurrentSnackbar()).toEqual(undefined);
});

test("Making a snackbar triggers the observer", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastSnackbar).toEqual(undefined);
    useCase.makeSnackbar("testing");
    expect(observer.lastSnackbar?.message).toEqual("testing");
    expect(useCase.getCurrentSnackbar()?.message).toEqual("testing");
});

test("Default duration is 4 seconds", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastSnackbar).toEqual(undefined);
    useCase.makeSnackbar("testing");
    expect(observer.lastSnackbar?.durationInSeconds).toEqual(4);
});

test("Snackbar duration can be set on creation of usecase", () => {
    const useCase: SnackbarUC = new SnackbarUCImp(2);
    const observer = new MockObserver();
    useCase.addObserver(observer);
    useCase.makeSnackbar("testing");
    expect(observer.lastSnackbar?.durationInSeconds).toEqual(2);
});

test("Observer can be removed", () => {
    const { useCase, observer } = makeTestRig();
    useCase.removeObserver(observer);
    useCase.makeSnackbar("testing");
    expect(observer.lastSnackbar).toEqual(undefined);
});

test("Snackbar duration can be set when made", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastSnackbar).toEqual(undefined);
    useCase.makeSnackbar("testing", undefined, 1);
    expect(observer.lastSnackbar?.durationInSeconds).toEqual(1);
});

test("Snackbar action can be set when made", () => {
    const actionFunction = jest.fn();
    const action: SnackbarAction = {
        actionButtonText: "action text",
        action: actionFunction
    }
    const { useCase, observer } = makeTestRig();
    expect(observer.lastSnackbar).toEqual(undefined);
    useCase.makeSnackbar("testing", action);
    expect(observer.lastSnackbar?.snackbarAction?.actionButtonText).toEqual("action text");
});

test("Current snackbar can be dismissed", () => {
    const { useCase, observer } = makeTestRig();
    useCase.makeSnackbar("testing");
    expect(observer.lastSnackbar?.message).toEqual("testing");
    useCase.dismissActiveSnackbar();
    expect(observer.lastSnackbar).toEqual(undefined);
});

test("Calling the active action", () => {
    const { useCase, observer } = makeTestRig();
    const actionFunction = jest.fn();
    useCase.makeSnackbar("testing", {
        action: actionFunction,
        actionButtonText: "action text"
    });
    useCase.callActiveSnackbarAction();
    expect(actionFunction).toHaveBeenCalled();
    expect(observer.lastSnackbar).toBeUndefined();
});

test("Snackbar with empty text throws error", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastSnackbar).toEqual(undefined);
    expect(() => useCase.makeSnackbar("")).toThrowError(SnackbarWithEmptyMessageError);
});

test("Snackbar with negative time throws error", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastSnackbar).toEqual(undefined);
    expect(() => useCase.makeSnackbar("testing", undefined, -2)).toThrowError(SnackbarWithInvalidDurationError);
});

test("Snackbar with negative time throws error", () => {
    const { useCase, observer } = makeTestRig();
    expect(observer.lastSnackbar).toEqual(undefined);
    expect(() => useCase.makeSnackbar("testing", { actionButtonText: "", action: () => { const test = 2} })).toThrowError(SnackbarWithEmptyActionButtonTextError);
});