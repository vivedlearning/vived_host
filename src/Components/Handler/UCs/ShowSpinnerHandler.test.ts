import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  makeDialogQueue,
  makeMockMakeSpinnerDialogUC,
  SpinnerDialogEntity
} from "../../Dialog";
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

  const mockMakeSpinner = makeMockMakeSpinnerDialogUC(appObjects);

  const uc = makeShowSpinnerHandler(ao);
  return { registerSpy, uc, mockMakeSpinner };
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

  it("Sets up the Dialog properties", () => {
    const { mockMakeSpinner, uc } = makeTestRig();

    const dto = makeBasicDTO();
    uc.action(dto);

    expect(mockMakeSpinner.make).toBeCalledWith({
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
