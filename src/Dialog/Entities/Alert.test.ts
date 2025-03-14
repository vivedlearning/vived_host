import { makeAppObjectRepo } from "@vived/core";
import { AlertDialogEntity, DialogAlertDTO, alertDialogType } from "./Alert";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("dialog1");
  const data: DialogAlertDTO = {
    buttonLabel: "button label",
    message: "a message",
    onClose: jest.fn(),
    title: "a title",
    preventOutsideDismiss: true
  };

  const alert = new AlertDialogEntity(data, ao);
  const observer = jest.fn();
  alert.addChangeObserver(observer);

  return { alert, observer, data, appObjects };
}

describe("Alert Dialog", () => {
  it("Sets the open to false when close is called", () => {
    const { alert } = makeTestRig();
    alert.isOpen = true;

    alert.close();

    expect(alert.isOpen).toEqual(false);
  });

  it("Calls the onClose when closed", () => {
    const { alert, data } = makeTestRig();

    alert.close();

    expect(data.onClose).toBeCalled();
  });

  it("Applies the data", () => {
    const { alert, data } = makeTestRig();

    expect(alert.message).toEqual(data.message);
    expect(alert.buttonLabel).toEqual(data.buttonLabel);
    expect(alert.title).toEqual(data.title);
    expect(alert.preventOutsideDismiss).toEqual(data.preventOutsideDismiss);
  });

  it("Sets the dialog type", () => {
    const { alert } = makeTestRig();

    expect(alert.dialogType).toEqual(alertDialogType);
  });

  it("Notifies when the is open flag changes", () => {
    const { alert, observer } = makeTestRig();

    alert.isOpen = true;

    observer.mockClear();

    alert.isOpen = true;
    alert.isOpen = true;
    alert.isOpen = true;

    expect(observer).not.toBeCalled();

    alert.isOpen = false;
    alert.isOpen = false;
    alert.isOpen = false;

    expect(observer).toBeCalledTimes(1);

    alert.isOpen = true;
    alert.isOpen = true;
    alert.isOpen = true;

    expect(observer).toBeCalledTimes(2);
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    AlertDialogEntity.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    AlertDialogEntity.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the UC when getting", () => {
    const { appObjects, alert } = makeTestRig();

    const returnedUC = AlertDialogEntity.get("dialog1", appObjects);

    expect(returnedUC).toEqual(alert);
  });

  it("Sets hasBeenClosed to true when close is called", () => {
    const { alert } = makeTestRig();
    alert.isOpen = true;
    alert.close();
    expect(alert.hasBeenClosed).toEqual(true);
  });
});
