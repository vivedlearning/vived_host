import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { ConfirmDialogEntity, makeDialogQueue } from "../../Dialog";
import { makeHostHandlerEntity } from "../Entities";
import {
  makeShowConfirmHandler,
  ShowConfirmActionDTO
} from "./ShowConfirmHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const dialogQueue = makeDialogQueue(appObjects.getOrCreate("Dialog"));
  const confirm = new ConfirmDialogEntity(
    {
      message: "msg",
      title: "title",
      cancelButtonLabel: "",
      confirmButtonLabel: ""
    },
    appObjects.getOrCreate("Confirm")
  );

  const mockConfirmFactory = jest.fn().mockReturnValue(confirm);
  dialogQueue.confirmDialogFactory = mockConfirmFactory;
  const mockSubmitDialog = jest.fn();
  dialogQueue.submitDialog = mockSubmitDialog;

  const uc = makeShowConfirmHandler(ao);
  return { registerSpy, uc, mockConfirmFactory, confirm, mockSubmitDialog };
}

function makeBasicDTO(): ShowConfirmActionDTO {
  return {
    title: "a title",
    message: "a message",
    confirmButtonLabel: "confirm button",
    cancelButtonLabel: "cancel button",
    confirmCallback: jest.fn(),
    cancelCallback: jest.fn()
  };
}

describe("Show Confirm Handler", () => {
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
      confirmButtonLabel: expectDTO.confirmButtonLabel,
      cancelButtonLabel: expectDTO.cancelButtonLabel,
      confirmCallback: expectDTO.confirmCallback,
      cancelCallback: expectDTO.cancelCallback
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
    const { mockSubmitDialog, uc, confirm } = makeTestRig();

    const dto = makeBasicDTO();
    uc.action(dto);

    expect(mockSubmitDialog).toBeCalledWith(confirm);
  });

  it("Sets up the Dialog properties", () => {
    const { mockConfirmFactory, uc } = makeTestRig();

    const dto = makeBasicDTO();
    uc.action(dto);

    expect(mockConfirmFactory).toBeCalledWith({
      title: dto.title,
      message: dto.message,
      cancelButtonLabel: dto.cancelButtonLabel,
      confirmButtonLabel: dto.confirmButtonLabel,
      onCancel: dto.cancelCallback,
      onConfirm: dto.confirmCallback
    });
  });
});
