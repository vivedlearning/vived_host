import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostHandlerEntity } from "../Entities";
import {
  IsAssetFetchedActionDTO,
  makeIsAssetFetchedHandler
} from "./IsAssetFetchedHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeIsAssetFetchedHandler(ao);
  return { registerSpy, uc };
}

function makeBasicDTO(): IsAssetFetchedActionDTO {
  return {
    assetId: "asset id",
    callback: jest.fn()
  };
}

describe("Is Asset Fetched Handler", () => {
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
      assetId: expectDTO.assetId,
      callback: expectDTO.callback
    };
    uc.handleRequest(1, payload);

    expect(uc.action).toBeCalledWith(payload);
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetId: "asset id",
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
