
import { DialogBase, DialogRepo, makeDialogRepo } from "../../Entities";
import { DialogPM, DialogVM } from "./DialogPM";

function makeTestRig() {
  const repo = makeDialogRepo();
  const view = jest.fn();
  const pm = new DialogPM(repo, view);

  return { repo, view, pm };
}

function addMockDialog(type: string, repo: DialogRepo): MockDialog {
  const d = new MockDialog(type);
  repo.submitDialog(d);
  return d;
}

class MockDialog extends DialogBase {
  val: string = "";

  constructor(type: string) {
    super(type);
  }
}

describe("Dialog PM", () => {
  it("Initializes the view", () => {
    const { view } = makeTestRig();
    expect(view).toBeCalledWith({ open: false });
  });

  it("Update the VM when a dialog become active", () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    const dialog = addMockDialog("a_dialog", repo);
    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as DialogVM;

    expect(vm.open).toEqual(dialog.isOpen);
    expect(vm.type).toEqual(dialog.type);
    expect(vm.dialog).toEqual(dialog);
  });

  it("Update the VM when a dialog changes", () => {
    const { view, repo } = makeTestRig();
    const dialog = addMockDialog("a_dialog", repo);
    expect(dialog.isOpen).toEqual(true);
    view.mockClear();

    dialog.isOpen = false;

    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as DialogVM;

    expect(vm.open).toEqual(false);
  });

  it("Update the VM when the dialog closes and the next dialog is null", () => {
    const { view, repo } = makeTestRig();
    addMockDialog("a_dialog", repo);
    view.mockClear();

    repo.activeDialogHasClosed();

    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as DialogVM;
    expect(vm.open).toEqual(false);
    expect(vm.type).toBeUndefined();
    expect(vm.dialog).toBeUndefined();
  });

  it("Update the VM when the dialog closes and the next dialog is different", () => {
    const { view, repo } = makeTestRig();
    addMockDialog("a_dialog", repo);
    const dialog2 = addMockDialog("a_different_dialog", repo);
    view.mockClear();

    repo.activeDialogHasClosed();

    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as DialogVM;
    expect(vm.open).toEqual(true);
    expect(vm.type).toEqual("a_different_dialog");
    expect(vm.dialog).toEqual(dialog2);
  });

  it("Update the VM when the dialog closes and the next dialog is the same type", () => {
    const { view, repo } = makeTestRig();
    const dialog1 = addMockDialog("a_dialog", repo);
    dialog1.val = "first";
    const dialog2 = addMockDialog("a_dialog", repo);
    dialog2.val = "second";
    view.mockClear();

    repo.activeDialogHasClosed();

    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as DialogVM;
    expect(vm.open).toEqual(true);
    expect(vm.type).toEqual("a_dialog");
    expect(vm.dialog).toEqual(dialog2);

    expect((vm.dialog as MockDialog).val).toEqual("second");
  });

  it("Previous dialog is no longer observed", () => {
    const { view, repo } = makeTestRig();
    const dialog1 = addMockDialog("a_dialog", repo);
    addMockDialog("a_dialog", repo);
    repo.activeDialogHasClosed();
    view.mockClear();

    dialog1.isOpen = !dialog1.isOpen;
    expect(view).not.toBeCalled();
  });

  it("Can be disposed", () => {
    const { view, repo, pm } = makeTestRig();
    const dialog = addMockDialog("a_dialog", repo);
    expect(dialog.isOpen).toEqual(true);
    view.mockClear();

    pm.dispose();

    dialog.isOpen = false;
    repo.activeDialogHasClosed();
    addMockDialog("a_dialog", repo);

    expect(view).not.toBeCalled();
  });
});
