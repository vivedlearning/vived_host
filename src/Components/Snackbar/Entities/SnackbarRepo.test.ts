import { makeAppObjectRepo } from "@vived/core";
import { makeSnackbarRepo, SnackbarAction, SnackbarRepo } from "./SnackbarRepo";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const snackbarRepo = makeSnackbarRepo(appObjects.getOrCreate("snackbar"));
  const observer = jest.fn();
  snackbarRepo.addChangeObserver(observer);
  return { snackbarRepo, observer, appObjects, registerSingletonSpy };
}

test("Gets the singleton", () => {
  const { snackbarRepo, appObjects } = makeTestRig();
  expect(SnackbarRepo.get(appObjects)).toEqual(snackbarRepo);
});

test("Registers as singleton", () => {
  const { registerSingletonSpy, snackbarRepo } = makeTestRig();
  expect(registerSingletonSpy).toBeCalledWith(snackbarRepo);
});

test("Initial state", () => {
  const { snackbarRepo } = makeTestRig();
  expect(snackbarRepo.getCurrentSnackbar()).toEqual(undefined);
});

test("Making a snackbar triggers the observer", () => {
  const { snackbarRepo, observer } = makeTestRig();

  snackbarRepo.makeSnackbar("testing");

  expect(observer).toBeCalled();
});

test("Default duration is 4 seconds", () => {
  const { snackbarRepo } = makeTestRig();
  snackbarRepo.makeSnackbar("testing");
  expect(snackbarRepo.getCurrentSnackbar()?.durationInSeconds).toEqual(4);
});

test("Snackbar duration can be set when made", () => {
  const { snackbarRepo } = makeTestRig();

  snackbarRepo.makeSnackbar("testing", undefined, 1);
  expect(snackbarRepo.getCurrentSnackbar()?.durationInSeconds).toEqual(1);
});

test("Snackbar action can be set when made", () => {
  const actionFunction = jest.fn();
  const action: SnackbarAction = {
    actionButtonText: "action text",
    action: actionFunction
  };
  const { snackbarRepo } = makeTestRig();

  snackbarRepo.makeSnackbar("testing", action);
  expect(
    snackbarRepo.getCurrentSnackbar()?.snackbarAction?.actionButtonText
  ).toEqual("action text");
});

test("Current snackbar can be dismissed", () => {
  const { snackbarRepo } = makeTestRig();
  snackbarRepo.makeSnackbar("testing");

  snackbarRepo.dismissActiveSnackbar();
  expect(snackbarRepo.getCurrentSnackbar()).toBeUndefined();
});

test("Calling the active action", () => {
  const { snackbarRepo } = makeTestRig();
  const actionFunction = jest.fn();
  snackbarRepo.makeSnackbar("testing", {
    action: actionFunction,
    actionButtonText: "action text"
  });
  snackbarRepo.callActiveSnackbarAction();
  expect(actionFunction).toHaveBeenCalled();
  expect(snackbarRepo.getCurrentSnackbar()).toBeUndefined();
});

test("Snackbar warns with empty text", () => {
  const { snackbarRepo } = makeTestRig();
  const warnSpy = jest.spyOn(snackbarRepo, "warn");

  snackbarRepo.makeSnackbar("");

  expect(warnSpy).toBeCalledWith("Snackbar must have a message");
});

test("Snackbar warns with negative time", () => {
  const { snackbarRepo } = makeTestRig();
  const warnSpy = jest.spyOn(snackbarRepo, "warn");

  snackbarRepo.makeSnackbar("testing", undefined, -2);

  expect(warnSpy).toBeCalledWith("-2 is an invalid duration for a Snackbar");
});

test("Snackbar warns with empty action button text", () => {
  const { snackbarRepo } = makeTestRig();
  const warnSpy = jest.spyOn(snackbarRepo, "warn");

  snackbarRepo.makeSnackbar("testing", {
    actionButtonText: "",
    action: () => {
      const test = 2;
    }
  });

  expect(warnSpy).toBeCalledWith(
    "If a Snackbar has an action then the action button text cannot be empty"
  );
});
