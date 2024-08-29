import { makeHostAppObjectRepo } from "../../../HostAppObject";
import {
  makeMockMakeMarkdownDialogUC
} from "../../Dialog";
import { makeHostHandlerEntity } from "../Entities";
import {
  makeShowMarkDownEditorHandler, ShowMarkDownEditorActionDTO
} from "./ShowMarkDownEditorHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const mockMakeMarkdown = makeMockMakeMarkdownDialogUC(appObjects);

  const uc = makeShowMarkDownEditorHandler(ao);
  return { registerSpy, uc, mockMakeMarkdown };
}

function makeBasicDTO(
  withOptional: boolean = true
): ShowMarkDownEditorActionDTO {
  if (!withOptional) {
    return {
      initialText: "initial text",
      submitCallback: jest.fn()
    };
  }

  return {
    initialText: "initial text",
    submitCallback: jest.fn(),
    validateString: jest.fn()
  };
}

describe("Show MarkDown Editor Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Converts the payload into the DTO for the action", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const expectDTOWithOptional = makeBasicDTO();
    const payloadWithOptional = {
      initialText: expectDTOWithOptional.initialText,
      submitCallback: expectDTOWithOptional.submitCallback,
      validateString: expectDTOWithOptional.validateString
    };
    uc.handleRequest(1, payloadWithOptional);

    expect(uc.action).toBeCalledWith(expectDTOWithOptional);

    const expectDTOWithoutOptional = makeBasicDTO(false);
    const payloadWithoutOptional = {
      initialText: expectDTOWithoutOptional.initialText,
      submitCallback: expectDTOWithoutOptional.submitCallback
    };
    uc.handleRequest(1, payloadWithoutOptional);

    expect(uc.action).toBeCalledWith(expectDTOWithoutOptional);
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
    const { mockMakeMarkdown, uc } = makeTestRig();

    const dto = makeBasicDTO();
    uc.action(dto);

    expect(mockMakeMarkdown.make).toBeCalledWith({
      initialText: dto.initialText,
      onConfirm: dto.submitCallback
    });
  });
});
