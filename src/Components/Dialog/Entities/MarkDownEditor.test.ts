import { makeAppObjectRepo } from "@vived/core";
import {
  MarkDownEditorDialogEntity,
  DialogMarkDownEditorDTO,
  markDownEditorDialogType
} from "./MarkDownEditor";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("dialog1");

  const data: DialogMarkDownEditorDTO = {
    onConfirm: jest.fn(),
    initialText: "initial text"
  };

  const dialog = new MarkDownEditorDialogEntity(data, ao);
  const observer = jest.fn();
  dialog.addChangeObserver(observer);

  return { dialog, observer, data, appObjects };
}

describe("MarkDown Editor Dialog", () => {
  it("Sets the open to false when cancel is called", () => {
    const { dialog } = makeTestRig();

    dialog.isOpen = true;
    dialog.cancel();

    expect(dialog.isOpen).toEqual(false);
  });

  it("Sets the open to false when accept is called", () => {
    const { dialog } = makeTestRig();

    dialog.isOpen = true;
    dialog.confirm("MarkDown Text");

    expect(dialog.isOpen).toEqual(false);
  });

  it("Calls the onAccept when accepted", () => {
    const { dialog, data } = makeTestRig();

    dialog.confirm("MarkDown Text");

    expect(data.onConfirm).toBeCalled();
  });

  it("Applies the data", () => {
    const { dialog, data } = makeTestRig();

    expect(dialog.initialText).toEqual(data.initialText);
  });

  it("Disable outside dismiss", () => {
    const { dialog } = makeTestRig();

    expect(dialog.preventOutsideDismiss).toEqual(true);
  });

  it("Sets the dialog type", () => {
    const { dialog } = makeTestRig();

    expect(dialog.dialogType).toEqual(markDownEditorDialogType);
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

    MarkDownEditorDialogEntity.get("unknownID", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Warns if the App Object does not have the UC when getting", () => {
    const { appObjects } = makeTestRig();

    appObjects.submitWarning = jest.fn();

    appObjects.getOrCreate("anAppObject");
    MarkDownEditorDialogEntity.get("anAppObject", appObjects);

    expect(appObjects.submitWarning).toBeCalled();
  });

  it("Returns the UC when getting", () => {
    const { appObjects, dialog } = makeTestRig();

    const returnedUC = MarkDownEditorDialogEntity.get("dialog1", appObjects);

    expect(returnedUC).toEqual(dialog);
  });
});
