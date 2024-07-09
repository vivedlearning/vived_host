import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeDialogQueue, SpinnerDialogEntity } from "../../Dialog";
import { makeHostHandlerEntity } from "../Entities";
import {
  makeShowSpinnerHandler,
  ShowSpinnerActionDTO
} from "./ShowSpinnerHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const dialogQueue = makeDialogQueue(appObjects.getOrCreate("Dialog"));
  const spinner = new SpinnerDialogEntity(
    {
      message: "msg",
      title: "title"
    },
    appObjects.getOrCreate("Spinner")
  );

  const mockSpinnerFactory = jest.fn().mockReturnValue(spinner);
  dialogQueue.spinnerDialogFactory = mockSpinnerFactory;
  const mockSubmitDialog = jest.fn();
  dialogQueue.submitDialog = mockSubmitDialog;

  const uc = makeShowSpinnerHandler(ao);
  return { registerSpy, uc, mockSpinnerFactory, spinner, mockSubmitDialog };
}

function makeBasicDTO(): ShowSpinnerActionDTO {
  return {
    message: "initial message",
    title: "initial title",
    closeCallback: jest.fn()
  };
}

describe("Show Spinner Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Converts the payload into the DTO for the action", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const expectDTO = makeBasicDTO();
    const payload = {
      message: expectDTO.message,
      title: expectDTO.title,
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

  it("Submits a Spinner dialog to the repo", () => {
    const { mockSubmitDialog, uc, spinner } = makeTestRig();

    const dto = makeBasicDTO();
    uc.action(dto);

    expect(mockSubmitDialog).toBeCalledWith(spinner);
  });

  it("Sets up the Dialog properties", () => {
    const { mockSpinnerFactory, uc } = makeTestRig();

    const dto = makeBasicDTO();
    uc.action(dto);

    expect(mockSpinnerFactory).toBeCalledWith({
      title: dto.title,
      message: dto.message
    });
  });

  it("Call callback always", () => {
    const { uc } = makeTestRig();

    const dto = makeBasicDTO();
    uc.action(dto);

    expect(dto.closeCallback).toBeCalled();
  });
});
