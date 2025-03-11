import { makeAppObjectRepo } from "@vived/core";
import { setupSnackbar } from "./Factories/setupSnackbar";
import { callActiveSnackbarAction, dismissActiveSnackbar } from "./Controllers";
import { snackbarAdapter } from "./Adapters/snackbarAdapter";
import { SnackbarRepo } from "./Entities/SnackbarRepo";
import { defaultSnackbarVM } from "./PMs/SnackbarPM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  setupSnackbar(appObjects);
  const setVM = jest.fn();
  snackbarAdapter.subscribe(appObjects, setVM);
  const repo = SnackbarRepo.get(appObjects);
  return { appObjects, setVM, repo };
}

describe("Snackbar Integration", () => {
  it("Initializes with default VM", () => {
    const { setVM } = makeTestRig();
    expect(setVM).toBeCalledWith(defaultSnackbarVM);
  });

  it("Shows snackbar when created", () => {
    const { repo, setVM } = makeTestRig();

    repo?.makeSnackbar("test message");

    expect(setVM).toBeCalledWith(
      expect.objectContaining({
        message: "test message",
        durationInSeconds: 4,
        actionButtonText: undefined
      })
    );
  });

  it("Clears snackbar when dismissed via controller", () => {
    const { repo, setVM, appObjects } = makeTestRig();

    repo?.makeSnackbar("test message");
    dismissActiveSnackbar(appObjects);

    expect(setVM).toBeCalledWith(defaultSnackbarVM);
  });

  it("Triggers action and dismisses via controller", () => {
    const { repo, setVM, appObjects } = makeTestRig();
    const actionFn = jest.fn();

    repo?.makeSnackbar("test message", {
      actionButtonText: "Click me",
      action: actionFn
    });

    callActiveSnackbarAction(appObjects);

    expect(actionFn).toBeCalled();
    expect(setVM).toBeCalledWith(defaultSnackbarVM);
  });

  it("Updates VM when snackbar changes", () => {
    const { repo, setVM } = makeTestRig();

    repo?.makeSnackbar("first message");
    repo?.dismissActiveSnackbar();
    repo?.makeSnackbar("second message", {
      actionButtonText: "Action",
      action: () => {}
    });

    expect(setVM).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "second message",
        actionButtonText: "Action"
      })
    );
  });

  it("Cleans up subscription on unsubscribe", () => {
    const { appObjects, setVM, repo } = makeTestRig();

    snackbarAdapter.unsubscribe(appObjects, setVM);
    repo?.makeSnackbar("test message");

    // Should still be at 1 call from initial subscription
    expect(setVM).toHaveBeenCalledTimes(1);
  });
});
