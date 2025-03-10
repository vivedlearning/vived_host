import { makeAppObjectRepo } from "@vived/core";
import { AlertDialogEntity } from "../Entities";
import { makeDialogQueue } from "../Entities/DialogQueue";
import {
  DialogQueuePM,
  DialogQueueVM,
  makeDialogQueuePM
} from "./DialogQueuePM";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const queue = makeDialogQueue(ao);

  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const pm = makeDialogQueuePM(ao);

  return { queue, pm, appObjects, registerSingletonSpy };
}

describe("Dialog PM", () => {
  it("Initializes the last vm", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Gets the singleton", () => {
    const { appObjects, pm } = makeTestRig();

    expect(DialogQueuePM.get(appObjects)).toEqual(pm);
  });

  it("Checks for equal VMs", () => {
    const { pm } = makeTestRig();

    const vm1: DialogQueueVM = {
      open: true,
      id: "anID",
      preventOutsideDismiss: true,
      dialogType: "aType"
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in is open", () => {
    const { pm } = makeTestRig();

    const vm1: DialogQueueVM = {
      open: true,
      id: "anID",
      preventOutsideDismiss: true,
      dialogType: "aType"
    };

    const vm2 = { ...vm1, open: false };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the id", () => {
    const { pm } = makeTestRig();

    const vm1: DialogQueueVM = {
      open: true,
      id: "anID",
      preventOutsideDismiss: true,
      dialogType: "aType"
    };

    const vm2 = { ...vm1, id: "a different id" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the prevent dismiss", () => {
    const { pm } = makeTestRig();

    const vm1: DialogQueueVM = {
      open: true,
      id: "anID",
      preventOutsideDismiss: true,
      dialogType: "aType"
    };

    const vm2 = { ...vm1, preventOutsideDismiss: false };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the dialog type", () => {
    const { pm } = makeTestRig();

    const vm1: DialogQueueVM = {
      open: true,
      id: "anID",
      preventOutsideDismiss: true,
      dialogType: "aType"
    };

    const vm2 = { ...vm1, dialogType: "something else" };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Update the VM when a dialog become active", () => {
    const { queue, pm, appObjects } = makeTestRig();

    const alert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert1")
    );
    queue.submitDialog(alert);

    expect(pm.lastVM?.open).toEqual(alert.isOpen);
    expect(pm.lastVM?.dialogType).toEqual(alert.dialogType);
    expect(pm.lastVM?.id).toEqual(alert.appObject.id);
  });

  it("Update the VM when a dialog changes", () => {
    const { queue, pm, appObjects } = makeTestRig();

    const alert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert1")
    );
    queue.submitDialog(alert);

    expect(pm.lastVM?.open).toEqual(true);

    alert.isOpen = false;

    expect(pm.lastVM?.open).toEqual(false);
  });

  it("Update the VM when the dialog closes and the next dialog is null", () => {
    const { queue, pm, appObjects } = makeTestRig();

    const alert = new AlertDialogEntity(
      {
        buttonLabel: "button",
        message: "message",
        title: "title"
      },
      appObjects.getOrCreate("alert1")
    );
    queue.submitDialog(alert);

    queue.activeDialogHasClosed();

    expect(pm.lastVM?.open).toEqual(false);
    expect(pm.lastVM?.dialogType).toBeUndefined();
    expect(pm.lastVM?.id).toBeUndefined();
  });
});
