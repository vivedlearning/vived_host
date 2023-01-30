
import { DialogBase, DialogConfirm, DialogConfirmDTO, makeDialogRepo } from "../../Entities";
import { ConfirmDialogPM, ConfirmDialogVM } from "./ConfirmDialogPM";

function makeTestRig() {
  const repo = makeDialogRepo();
  const view = jest.fn();
  const pm = new ConfirmDialogPM(repo, view);

  return { pm, view, repo };
}

function makeMockDialog(type: string): DialogBase {
  return new DialogBase(type);
}

describe("Confirm Dialog PM", () => {
  it("Initializes the view", () => {
    const { view } = makeTestRig();
    expect(view).toBeCalled();
  });

  it("Sets up the VM when an confirm is added to the repo", () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button",
      cancelButtonLabel: "cancel button",
      message: "a message",
      title: "a title",
    };

    const confirm = new DialogConfirm(data);
    repo.submitDialog(confirm);

    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as ConfirmDialogVM;

    expect(vm.title).toEqual(data.title);
    expect(vm.message).toEqual(data.message);
    expect(vm.cancelButtonLabel).toEqual(data.cancelButtonLabel);
    expect(vm.confirmButtonLabel).toEqual(data.confirmButtonLabel);
    expect(vm.cancel).toEqual(confirm.cancel);
    expect(vm.confirm).toEqual(confirm.confirm);
  });

  it("Goes back to null with the dialog is closed", () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button",
      cancelButtonLabel: "cancel button",
      message: "a message",
      title: "a title",
    };
    const confirm = new DialogConfirm(data);
    repo.submitDialog(confirm);

    confirm.confirm();
    view.mockClear();
    repo.activeDialogHasClosed();

    expect(view).toBeCalled();
  });

  it("Unsubscribes from the confirm after it is closed", () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button",
      cancelButtonLabel: "cancel button",
      message: "a message",
      title: "a title",
    };
    const confirm = new DialogConfirm(data);
    repo.submitDialog(confirm);

    confirm.confirm();
    repo.activeDialogHasClosed();
    view.mockClear();

    confirm.notify();

    expect(view).not.toBeCalled();
  });

  it("Does not update if the dialog is not an confirm", () => {
    const { view, repo } = makeTestRig();
    view.mockClear();
    repo.submitDialog(makeMockDialog("something other dialog"));

    expect(view).not.toBeCalled();
  });

  it("Updates the VM when the dialog changes", () => {
    const { view, repo } = makeTestRig();

    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button",
      cancelButtonLabel: "cancel button",
      message: "a message",
      title: "a title",
    };
    const confirm = new DialogConfirm(data);
    repo.submitDialog(confirm);
    repo.submitDialog(makeMockDialog("something other dialog"));
    view.mockClear();

    repo.activeDialogHasClosed();

    expect(view).toBeCalled();
  });

  it("Unsubscribes from the confirm when dialog changes to something else", () => {
    const { view, repo } = makeTestRig();

    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button",
      cancelButtonLabel: "cancel button",
      message: "a message",
      title: "a title",
    };
    const confirm = new DialogConfirm(data);
    repo.submitDialog(confirm);
    repo.submitDialog(makeMockDialog("something other dialog"));
    repo.activeDialogHasClosed();
    view.mockClear();

    confirm.notify();
    expect(view).not.toBeCalled();
  });

  it("Unsubscribes from the confirm when dialog changes to a different confirm", () => {
    const { view, repo } = makeTestRig();

    const data1: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button",
      cancelButtonLabel: "cancel button",
      message: "a message",
      title: "a title",
    };
    const confirm1 = new DialogConfirm(data1);
    repo.submitDialog(confirm1);

    const data2: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button 2",
      cancelButtonLabel: "cancel button 2",
      message: "a message 2",
      title: "a title 2",
    };
    const confirm2 = new DialogConfirm(data2);
    repo.submitDialog(confirm2);

    repo.activeDialogHasClosed();
    view.mockClear();

    confirm2.notify();
    expect(view).not.toBeCalled();
  });

  it("Updates the VM when it changes to a different confirm", () => {
    const { view, repo } = makeTestRig();

    const data1: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button",
      cancelButtonLabel: "cancel button",
      message: "a message",
      title: "a title",
    };
    const confirm1 = new DialogConfirm(data1);
    repo.submitDialog(confirm1);

    const data2: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button 2",
      cancelButtonLabel: "cancel button 2",
      message: "a message 2",
      title: "a title 2",
    };
    const confirm2 = new DialogConfirm(data2);
    repo.submitDialog(confirm2);
    view.mockClear();

    repo.activeDialogHasClosed();
    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as ConfirmDialogVM;

    expect(vm.title).toEqual(data2.title);
    expect(vm.message).toEqual(data2.message);
    expect(vm.cancelButtonLabel).toEqual(data2.cancelButtonLabel);
    expect(vm.confirmButtonLabel).toEqual(data2.confirmButtonLabel);
    expect(vm.cancel).toEqual(confirm2.cancel);
    expect(vm.confirm).toEqual(confirm2.confirm);
  });

  it("Can be disposed", ()=>{
    const { view, repo, pm } = makeTestRig();

    const data: DialogConfirmDTO = {
      confirmButtonLabel: "confirm button",
      cancelButtonLabel: "cancel button",
      message: "a message",
      title: "a title",
    };
    const confirm = new DialogConfirm(data);
    repo.submitDialog(confirm);
    view.mockClear();

    pm.dispose();

    confirm.confirm();
    repo.activeDialogHasClosed();

    expect(view).not.toBeCalled();
  })
});
