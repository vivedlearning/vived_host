
import { DialogBase, DialogSpinner, makeDialogRepo } from "../../Entities";
import { SpinnerDialogPM, SpinnerDialogVM } from "./SpinnerDialogPM";

function makeTestRig() {
  const repo = makeDialogRepo();
  const view = jest.fn();

  const spinner = new DialogSpinner("a title", "a message");
  repo.submitDialog(spinner);

  const pm = new SpinnerDialogPM(repo, view);

  return { pm, view, repo, spinner };
}

describe("Spinner Dialog PM", () => {
  it("Initializes the view", () => {
    const { view, spinner } = makeTestRig();

    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as SpinnerDialogVM;

    expect(vm.title).toEqual(spinner.title);
    expect(vm.message).toEqual(spinner.message);
  });

  it("Goes back to null with the dialog is closed", () => {
    const { view, repo } = makeTestRig();
    view.mockClear();

    repo.activeDialogHasClosed();

    expect(view).toBeCalledWith(null);
  });

  it("Unsubscribes from the spinner after it is closed", () => {
    const { view, repo, spinner } = makeTestRig();
    view.mockClear();

    repo.activeDialogHasClosed();
    view.mockClear();

    spinner.notify();

    expect(view).not.toBeCalled();
  });

  it("Does not update if the dialog is not an spinner", () => {
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

  it("Unsubscribes from the spinner when dialog changes to something else", () => {
    const { view, repo, spinner } = makeTestRig();

    repo.submitDialog(new DialogBase("some other dialog"));
    repo.activeDialogHasClosed();
    view.mockClear();

    spinner.notify();
    expect(view).not.toBeCalled();
  });

  it("Unsubscribes from the spinner when dialog changes to a different spinner", () => {
    const { view, repo, spinner } = makeTestRig();

    const spinner2 = new DialogSpinner("a title", "a message");
    repo.submitDialog(spinner2);

    repo.activeDialogHasClosed();
    view.mockClear();

    spinner.notify();
    expect(view).not.toBeCalled();
  });

  it("Updates the VM when it changes to a different spinner", () => {
    const { view, repo } = makeTestRig();

    const spinner2 = new DialogSpinner("a differnt title", "a different message");
    repo.submitDialog(spinner2);
    view.mockClear();

    repo.activeDialogHasClosed();
    expect(view).toBeCalled();
    const vm = view.mock.calls[0][0] as SpinnerDialogVM;

    expect(vm.title).toEqual(spinner2.title);
    expect(vm.message).toEqual(spinner2.message);
  });

  it("Can be disposed", ()=>{
    const { view, repo, pm, spinner } = makeTestRig();

    view.mockClear();

    pm.dispose();

    spinner.notify();
    repo.activeDialogHasClosed();

    expect(view).not.toBeCalled();
  })
});
