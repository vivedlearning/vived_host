import { DialogBase } from "./DialogBase";
import { makeDialogRepo } from "./DialogRepo";

class MockDialog extends DialogBase {
  private _open = false;
  get isOpen(): boolean {
    return this._open;
  }
  set isOpen(open: boolean) {
    this._open = open;
  }
  constructor(type: string) {
    super(type);
  }
}

function makeTestRig() {
  const dialogRepo = makeDialogRepo();
  const observer = jest.fn();
  dialogRepo.addObserver(observer);

  return { dialogRepo, observer };
}

describe("Dialog Repo Entity", () => {
  it("Allows a dialog to be sumbitted", () => {
    const { dialogRepo } = makeTestRig();
    const dialog = new MockDialog("a dialog");

    dialogRepo.submitDialog(dialog);

    expect(dialogRepo.activeDialog).toEqual(dialog);
    expect(dialog.isOpen).toEqual(true);
  });

  it("Calls the show when a dialog is added and it is the active one", () => {
    const { dialogRepo, observer } = makeTestRig();
    const dialog = new MockDialog("a dialog");
    dialogRepo.submitDialog(dialog);

    expect(dialogRepo.activeDialog).toEqual(dialog);
    expect(observer).toBeCalled();
  });

  it("Dismisses the active dialog", () => {
    const { dialogRepo, observer } = makeTestRig();
    const dialog = new MockDialog("a dialog");
    dialogRepo.submitDialog(dialog);

    observer.mockClear();
    expect(dialogRepo.activeDialog).toEqual(dialog);

    dialogRepo.activeDialogHasClosed();

    expect(observer).toBeCalled();
    expect(dialogRepo.activeDialog).toBeNull();
  });

  it("Does not notify if there is no dialog to dismiss", () => {
    const { dialogRepo, observer } = makeTestRig();
    expect(dialogRepo.activeDialog).toBeNull();

    dialogRepo.activeDialogHasClosed();

    expect(observer).not.toBeCalled();
  });

  it("Sets the next dialog in the queue as active", () => {
    const { dialogRepo, observer } = makeTestRig();
    const firstDialog = new MockDialog("a dialog");
    dialogRepo.submitDialog(firstDialog);

    const secondDialog = new MockDialog("a dialog");
    dialogRepo.submitDialog(secondDialog);
    observer.mockClear();

    expect(dialogRepo.activeDialog).toEqual(firstDialog);

    dialogRepo.activeDialogHasClosed();

    expect(dialogRepo.activeDialog).toEqual(secondDialog);
    expect(observer).toBeCalled();
  });

  it("Sets the open when it is time to show the second dialog", () => {
    const { dialogRepo } = makeTestRig();
    const firstDialog = new MockDialog("a dialog");
    dialogRepo.submitDialog(firstDialog);

    const secondDialog = new MockDialog("a dialog");
    dialogRepo.submitDialog(secondDialog);

    expect(secondDialog.isOpen).toEqual(false);

    dialogRepo.activeDialogHasClosed();

    expect(secondDialog.isOpen).toEqual(true);
  });

  it("Allows an observer to be removed", () => {
    const { dialogRepo, observer } = makeTestRig();

    dialogRepo.removeObserver(observer);

    const firstDialog = new MockDialog("a dialog");
    dialogRepo.submitDialog(firstDialog);
    dialogRepo.activeDialogHasClosed();

    expect(observer).not.toBeCalled();
  });
});
