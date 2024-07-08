import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeHostHandlerEntity } from "../Entities";
import {
  makeSubmitResultHandler,
  MultiHitResultV1
} from "./SubmitResultHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const uc = makeSubmitResultHandler(ao);
  return { registerSpy, uc };
}

describe("Submit Result Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Throws an error if the action is not overwritten", () => {
    const { uc } = makeTestRig();

    expect(() =>
      uc.action("HIT_V1", { success: true }, "A question!")
    ).toThrowError();
  });

  it("Throws an unsupported error for version 1", () => {
    const { uc } = makeTestRig();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });

  it("Triggers the action for v2", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const result: MultiHitResultV1 = {
      hits: 1,
      misses: 2,
      unanswered: 3
    };

    const payload = {
      tries: 5,
      description: "A Question!",
      result,
      resultType: "MULTIHIT_V1"
    };

    uc.handleRequest(2, payload);

    expect(uc.action).toBeCalledWith("MULTIHIT_V1", result, "A Question!");
  });

  it("Triggers the action for v3", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const result: MultiHitResultV1 = {
      hits: 1,
      misses: 2,
      unanswered: 3
    };

    const payload = {
      description: "A Question!",
      result,
      resultType: "MULTIHIT_V1"
    };

    uc.handleRequest(3, payload);

    expect(uc.action).toBeCalledWith("MULTIHIT_V1", result, "A Question!");
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

  it("Throws if the v2 payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(2, payload)).toThrowError();
  });

  it("Throws if the v3 payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(3, payload)).toThrowError();
  });
});
