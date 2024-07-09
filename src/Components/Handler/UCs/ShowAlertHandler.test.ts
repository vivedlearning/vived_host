import { makeHostHandler } from "../../../Entities";
import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { AlertDialogEntity, makeDialogQueue } from "../../Dialog";
import { makeHostHandlerEntity } from "../Entities";
import { ShowAlertActionDTO, makeShowAlertHandler } from "./ShowAlertHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const dialogQueue = makeDialogQueue(appObjects.getOrCreate("Dialog"));
  const mockSubmitDialog = jest.fn();
  dialogQueue.submitDialog = mockSubmitDialog;

  const alertDialog = new AlertDialogEntity(
    {
      title: "a title",
      message: "a message",
      buttonLabel: "confirm button",
      onClose: jest.fn()
    },
    appObjects.getOrCreate("Alert")
  );

  const mockAlertFactory = jest.fn().mockReturnValue(alertDialog);
  dialogQueue.alertDialogFactory = mockAlertFactory;

  const uc = makeShowAlertHandler(ao);
  return { registerSpy, uc, mockSubmitDialog, mockAlertFactory, alertDialog };
}

function makeBasicDTO(): ShowAlertActionDTO {
  return {
    title: "a title",
    message: "a message",
    closeButtonLabel: "confirm button",
    closeCallback: jest.fn()
  };
}

describe("Show Alert Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Converts the payload into the DTO for the action", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const expectDTO = makeBasicDTO();
    const payload = {
      title: expectDTO.title,
      message: expectDTO.message,
      closeButtonLabel: expectDTO.closeButtonLabel,
      closeCallback: expectDTO.closeCallback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith(expectDTO);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      callback: mockCallback
    };

    expect(() => uc.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });

  it("Submits a Confirm dialog to the repo", () => {
    const { mockSubmitDialog, uc, alertDialog } = makeTestRig();

    const dto = makeBasicDTO();
    uc.action(dto);

    expect(mockSubmitDialog).toBeCalledWith(alertDialog);
  });

  it("Sets up the Dialog properties", () => {
    const { mockAlertFactory, uc } = makeTestRig();

    const dto = makeBasicDTO();
    uc.action(dto);

    expect(mockAlertFactory).toBeCalledWith({
      title: dto.title,
      message: dto.message,
      buttonLabel: dto.closeButtonLabel,
      onClose: dto.closeCallback
    });
  });
});
