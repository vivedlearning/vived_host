import { makeAppObjectRepo } from "@vived/core";
import { AlertDialogEntity, makeDialogQueue } from "../Entities";
import { MakeAlertDialogUC, makeMakeAlertDialogUC } from "./MakeAlertDialogUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const resisterSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const dialogQueue = makeDialogQueue(appObjects.getOrCreate("dialog"));

  const uc = makeMakeAlertDialogUC(appObjects.getOrCreate("dialog"));

  const mockAlert = new AlertDialogEntity(
    { buttonLabel: "", message: "", title: "" },
    appObjects.getOrCreate("Alert")
  );
  const alertFactory = jest.fn().mockReturnValue(mockAlert);
  uc.factory = alertFactory;

  return {
    uc,
    dialogQueue,
    appObjects,
    resisterSingletonSpy,
    alertFactory,
    mockAlert
  };
}

describe("Make Alert Dialog UC", () => {
  it("Gets the UC", () => {
    const { uc, appObjects } = makeTestRig();
    expect(MakeAlertDialogUC.get(appObjects)).toEqual(uc);
  });

  it("Registers as the singleton", () => {
    const { uc, resisterSingletonSpy } = makeTestRig();

    expect(resisterSingletonSpy).toBeCalledWith(uc);
  });

  it("Submits a dialog to the queue", () => {
    const { uc, dialogQueue, mockAlert } = makeTestRig();

    dialogQueue.submitDialog = jest.fn();

    uc.make({
      buttonLabel: "button",
      message: "Message",
      title: "Title"
    });

    expect(dialogQueue.submitDialog).toBeCalledWith(mockAlert);
  });

  it("Gets a dialog from the factory", () => {
    const { uc } = makeTestRig();

    const factorySpy = jest.spyOn(uc, "factory");

    const dto = {
      buttonLabel: "button",
      message: "Message",
      title: "Title"
    };

    uc.make(dto);

    expect(factorySpy).toBeCalledWith(dto);
  });
});
