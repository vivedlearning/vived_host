import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { AlertDialogEntity } from "./Alert";
import { DialogQueue, makeDialogQueue } from "./DialogQueue";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("Queue");
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const dialogRepo = makeDialogQueue(ao);
  const observer = jest.fn();
  dialogRepo.addChangeObserver(observer);

  return { dialogRepo, observer, appObjects, registerSingletonSpy };
}

describe("Dialog Repo Entity", () => {
  it("Gets the singleton", () => {
    const { dialogRepo, appObjects } = makeTestRig();

    expect(DialogQueue.get(appObjects)).toEqual(dialogRepo);
  });

  it("Registers as the singleton", () => {
    const { dialogRepo, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(dialogRepo);
  });

  it("Allows a dialog to be submitted", () => {
    const { dialogRepo, appObjects } = makeTestRig();

    const alert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert")
    );
    dialogRepo.submitDialog(alert);

    expect(dialogRepo.activeDialog).toEqual(alert);
    expect(alert.isOpen).toEqual(true);
  });

  it("Calls the show when a dialog is added and it is the active one", () => {
    const { dialogRepo, observer, appObjects } = makeTestRig();
    const alert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert")
    );
    dialogRepo.submitDialog(alert);

    expect(dialogRepo.activeDialog).toEqual(alert);
    expect(observer).toBeCalled();
  });

  it("Dismisses the active dialog", () => {
    const { dialogRepo, observer, appObjects } = makeTestRig();
    const alert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert")
    );
    dialogRepo.submitDialog(alert);

    observer.mockClear();
    expect(dialogRepo.activeDialog).toEqual(alert);

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
    const { dialogRepo, observer, appObjects } = makeTestRig();
    const firstAlert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert1")
    );
    dialogRepo.submitDialog(firstAlert);

    const secondAlert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert2")
    );
    dialogRepo.submitDialog(secondAlert);

    observer.mockClear();

    expect(dialogRepo.activeDialog).toEqual(firstAlert);

    dialogRepo.activeDialogHasClosed();

    expect(dialogRepo.activeDialog).toEqual(secondAlert);
    expect(observer).toBeCalled();
  });

  it("Sets the open when it is time to show the second dialog", () => {
    const { dialogRepo, appObjects } = makeTestRig();
    const firstAlert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert1")
    );
    dialogRepo.submitDialog(firstAlert);

    const secondAlert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert2")
    );
    dialogRepo.submitDialog(secondAlert);

    expect(secondAlert.isOpen).toEqual(false);

    dialogRepo.activeDialogHasClosed();

    expect(secondAlert.isOpen).toEqual(true);
  });

  it("Forwards notifications from the dialogs in the queue", () => {
    const { dialogRepo, appObjects, observer } = makeTestRig();
    const firstAlert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert1")
    );
    dialogRepo.submitDialog(firstAlert);

    const secondAlert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert2")
    );
    dialogRepo.submitDialog(secondAlert);

    observer.mockClear();

    firstAlert.notifyOnChange();
    expect(observer).toBeCalledTimes(1);

    secondAlert.notifyOnChange();
    expect(observer).toBeCalledTimes(2);
  });

  it("Stops forwarding when the dialog is dismissed", () => {
    const { dialogRepo, appObjects, observer } = makeTestRig();
    const firstAlert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert1")
    );
    dialogRepo.submitDialog(firstAlert);

    dialogRepo.activeDialogHasClosed();

    observer.mockClear();

    firstAlert.notifyOnChange();
    expect(observer).not.toBeCalled();
  });

  it("Filters out closed dialogs when dismissing active dialog", () => {
    const { dialogRepo, appObjects, observer } = makeTestRig();
    const firstAlert = new AlertDialogEntity(
      {
        buttonLabel: "button1",
        message: "message1",
        title: "title1"
      },
      appObjects.getOrCreate("alert1")
    );
    dialogRepo.submitDialog(firstAlert);

    const secondAlert = new AlertDialogEntity(
      {
        buttonLabel: "button2",
        message: "message2",
        title: "title2"
      },
      appObjects.getOrCreate("alert2")
    );
    dialogRepo.submitDialog(secondAlert);

    // Mark the second alert as closed before dismissing the active dialog.
    secondAlert.hasBeenClosed = true;

    // Dismiss the active (first) dialog.
    dialogRepo.activeDialogHasClosed();

    // The closed secondAlert should be filtered out and no active dialog remains.
    expect(dialogRepo.activeDialog).toBeNull();
  });
});
