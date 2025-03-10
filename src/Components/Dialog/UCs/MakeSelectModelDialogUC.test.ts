import { makeAppObjectRepo } from "@vived/core";
import { AlertDialogEntity, makeDialogQueue } from "../Entities";
import {
  MakeSelectModelDialogUC,
  makeMakeSelectModelDialogUC
} from "./MakeSelectModelDialogUC";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const resisterSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const dialogQueue = makeDialogQueue(appObjects.getOrCreate("dialog"));

  const uc = makeMakeSelectModelDialogUC(appObjects.getOrCreate("dialog"));

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

describe("Make Select Model Dialog UC", () => {
  it("Gets the UC", () => {
    const { uc, appObjects } = makeTestRig();
    expect(MakeSelectModelDialogUC.get(appObjects)).toEqual(uc);
  });

  it("Registers as the singleton", () => {
    const { uc, resisterSingletonSpy } = makeTestRig();

    expect(resisterSingletonSpy).toBeCalledWith(uc);
  });

  it("Submits a dialog to the queue", () => {
    const { uc, dialogQueue, mockAlert } = makeTestRig();

    dialogQueue.submitDialog = jest.fn();

    uc.make();

    expect(dialogQueue.submitDialog).toBeCalledWith(mockAlert);
  });

  it("Gets a dialog from the factory", () => {
    const { uc } = makeTestRig();

    const factorySpy = jest.spyOn(uc, "factory");

    uc.make();

    expect(factorySpy).toBeCalledWith();
  });
});
