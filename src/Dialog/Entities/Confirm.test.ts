import { makeAppObjectRepo } from "@vived/core";
import {
  confirmDialogType,
  DialogConfirmDTO,
  ConfirmDialogEntity
} from "./Confirm";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("dialog1");

  const data: DialogConfirmDTO = {
    confirmButtonLabel: "confirm label",
    cancelButtonLabel: "cancel label",
    message: "a message",
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    title: "a title"
  };

  const dialog = new ConfirmDialogEntity(data, ao);
  const observer = jest.fn();
  dialog.addChangeObserver(observer);

  return { dialog, observer, data, appObjects };
}

describe("Alert Dialog", () => {
  it("Sets the open to false when cancel is called", () => {
    const { dialog } = makeTestRig();
    dialog.isOpen = true;
    dialog.cancel();

    expect(dialog.isOpen).toEqual(false);
  });

  it("Calls the onCancel when cancelled", () => {
    const { dialog, data } = makeTestRig();

    dialog.cancel();

    expect(data.onCancel).toBeCalled();
  });

  it("Sets the open to false when accept is called", () => {
    const { dialog } = makeTestRig();

    dialog.isOpen = true;
    dialog.confirm();

    expect(dialog.isOpen).toEqual(false);
  });

  it("Calls the onAccept when accepted", () => {
    const { dialog, data } = makeTestRig();

    dialog.confirm();

    expect(data.onConfirm).toBeCalled();
  });

  it("Applies the data", () => {
    const { dialog, data } = makeTestRig();

    expect(dialog.message).toEqual(data.message);
    expect(dialog.confirmButtonLabel).toEqual(data.confirmButtonLabel);
    expect(dialog.cancelButtonLabel).toEqual(data.cancelButtonLabel);
    expect(dialog.title).toEqual(data.title);
  });

  it("Sets the dialog type", () => {
    const { dialog } = makeTestRig();

    expect(dialog.dialogType).toEqual(confirmDialogType);
  });

  it("Disable outside dismiss", () => {
    const { dialog } = makeTestRig();

    expect(dialog.preventOutsideDismiss).toEqual(true);
  });

  it("Notifies when the is open flag changes", () => {
    const { dialog, observer } = makeTestRig();

    dialog.isOpen = true;

    observer.mockClear();

    dialog.isOpen = true;
    dialog.isOpen = true;
    dialog.isOpen = true;

    expect(observer).not.toBeCalled();

    dialog.isOpen = false;
    dialog.isOpen = false;
    dialog.isOpen = false;

    expect(observer).toBeCalledTimes(1);

    dialog.isOpen = true;
    dialog.isOpen = true;
    dialog.isOpen = true;

    expect(observer).toBeCalledTimes(2);
  });

  it("Warns if it cannot find the app object by ID when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    ConfirmDialogEntity.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    ConfirmDialogEntity.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the UC when getting", () => {
    const { appObjects, dialog } = makeTestRig();

    const returnedUC = ConfirmDialogEntity.get("dialog1", appObjects);

    expect(returnedUC).toEqual(dialog);
  });
});
