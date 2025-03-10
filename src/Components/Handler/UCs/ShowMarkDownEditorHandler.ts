import { AppObject, AppObjectUC } from "@vived/core";
import {
  DialogMarkDownEditorDTO,
  DialogQueue,
  MakeMarkdownDialogUC
} from "../../Dialog";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export interface ShowMarkDownEditorActionDTO {
  initialText: string;
  submitCallback: (text: string) => void;
  validateString?: (text: string) => string | null;
}

export type ShowMarkDownEditorAction = (
  confirmData: ShowMarkDownEditorActionDTO
) => void;

export abstract class ShowMarkDownEditorHandler
  extends AppObjectUC
  implements RequestHandler {
  static readonly type = "ShowMarkDownEditorHandler";

  readonly requestType = "SHOW_MARKDOWN_EDITOR";

  abstract action: ShowMarkDownEditorAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeShowMarkDownEditorHandler(
  appObject: AppObject
): ShowMarkDownEditorHandler {
  return new ShowMarkDownEditorHandlerImp(appObject);
}

export class ShowMarkDownEditorHandlerImp extends ShowMarkDownEditorHandler {
  action: ShowMarkDownEditorAction = (
    actionDTO: ShowMarkDownEditorActionDTO
  ) => {
    const { initialText, submitCallback } = actionDTO;

    MakeMarkdownDialogUC.make(
      {
        initialText,
        onConfirm: submitCallback
      },
      this.appObjects
    );
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const castPayload = this.castPayloadV1(payload);
      this.action(castPayload);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): ShowMarkDownEditorActionDTO {
    const castPayload = payload as Payload_V1;
    if (
      castPayload.initialText === undefined ||
      castPayload.submitCallback === undefined
    ) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: AppObject) {
    super(appObject, ShowMarkDownEditorHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  initialText: string;
  submitCallback: (text: string) => void;
  validateString?: (text: string) => string | null;
};
