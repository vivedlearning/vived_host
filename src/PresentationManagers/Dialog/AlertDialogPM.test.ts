import { DialogAlert, DialogAlertDTO, DialogBase, makeDialogRepo } from "../../Entities";
import { AlertDialogPM, AlertDialogVM } from "./AlertDialogPM";

function makeTestRig() {
  const repo = makeDialogRepo();
  const view = jest.fn();

  const data: DialogAlertDTO = {
    buttonLabel: "a button",
    message: "a message",
    onClose: jest.fn(),
    title: "a title",
  };

  const alert = new DialogAlert(data);
  repo.submitDialog(alert);

  const pm = new AlertDialogPM(repo, view);

  return { pm, view, repo, alert };
}

describe("Alert Dialog PM", () => {
  it("Initializes the view", () => {
    const { view, alert } = makeTestRig();

    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as AlertDialogVM;

    expect(vm.title).toEqual(alert.title);
    expect(vm.message).toEqual(alert.message);
    expect(vm.buttonLabel).toEqual(alert.buttonLabel);
    expect(vm.close).toEqual(alert.close);
  });

  it("Goes back to null with the dialog is closed", () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    repo.activeDialogHasClosed();

    expect(view).toBeCalledWith(null);
  });

  it("Unsubscribes from the alert after it is closed", () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    const data: DialogAlertDTO = {
      buttonLabel: "a button",
      message: "a message",
      onClose: jest.fn(),
      title: "a title",
    };
    const alert = new DialogAlert(data);
    repo.submitDialog(alert);

    alert.close();
    repo.activeDialogHasClosed();
    view.mockClear();

    alert.notify();

    expect(view).not.toBeCalled();
  });

  it("Does not update if the dialog is not an alert", () => {
    const { view, repo } = makeTestRig();
    view.mockClear();
    repo.submitDialog(new DialogBase("some other dialog"));

    expect(view).not.toBeCalled();
  });

  it("Updates the VM when the dialog changes", () => {
    const { view, repo } = makeTestRig();

    repo.submitDialog(new DialogBase("some other dialog"));
    view.mockClear();

    repo.activeDialogHasClosed();

    expect(view).toBeCalledWith(null);
  });

  it("Unsubscribes from the alert when dialog changes to something else", () => {
    const { view, repo, alert } = makeTestRig();

    repo.submitDialog(new DialogBase("some other dialog"));
    repo.activeDialogHasClosed();
    view.mockClear();

    alert.notify();
    expect(view).not.toBeCalled();
  });

  it("Unsubscribes from the alert when dialog changes to a different alert", () => {
    const { view, repo } = makeTestRig();

    const data1: DialogAlertDTO = {
      buttonLabel: "a button",
      message: "a message",
      onClose: jest.fn(),
      title: "a title",
    };
    const alert1 = new DialogAlert(data1);
    repo.submitDialog(alert1);

    const data2: DialogAlertDTO = {
      buttonLabel: "a button",
      message: "a message",
      onClose: jest.fn(),
      title: "a title",
    };
    const alert2 = new DialogAlert(data2);
    repo.submitDialog(alert2);

    repo.activeDialogHasClosed();
    view.mockClear();

    alert1.notify();
    expect(view).not.toBeCalled();
  });

  it("Updates the VM when it changes to a different alert", () => {
    const { view, repo } = makeTestRig();

    const data2: DialogAlertDTO = {
      buttonLabel: "a different button",
      message: "a different message",
      onClose: jest.fn(),
      title: "a different title",
    };
    const alert2 = new DialogAlert(data2);
    repo.submitDialog(alert2);
    view.mockClear();

    repo.activeDialogHasClosed();
    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as AlertDialogVM;

    expect(vm.title).toEqual(data2.title);
    expect(vm.message).toEqual(data2.message);
    expect(vm.buttonLabel).toEqual(data2.buttonLabel);
    expect(vm.close).toEqual(alert2.close);
  });

  it("Can be disposed", ()=>{
    const { view, repo, pm } = makeTestRig();

    const data: DialogAlertDTO = {
      buttonLabel: "a button",
      message: "a message",
      onClose: jest.fn(),
      title: "a title",
    };
    const alert = new DialogAlert(data);
    repo.submitDialog(alert);
    view.mockClear();

    pm.dispose();

    alert.close();
    repo.activeDialogHasClosed();

    expect(view).not.toBeCalled();
  })
});
