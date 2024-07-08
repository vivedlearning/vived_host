import { makeHostHandler } from "../../../Entities";
import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostHandlerEntity } from "../Entities";
import {
  ShowConfirmActionDTO,
  makeShowConfirmHandler
} from "./ShowConfirmHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeShowConfirmHandler(ao);
  return { registerSpy, uc };
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

  it("Throws an error if the action is not overwritten", () => {
    const { uc } = makeTestRig();

    expect(() => uc.action(makeBasicDTO())).toThrowError();
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
});
