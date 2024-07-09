import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { DialogMarkDownEditorDTO, DialogQueue } from "../../Dialog";
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
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "ShowMarkDownEditorHandler";

  readonly requestType = "SHOW_MARKDOWN_EDITOR";

  abstract action: ShowMarkDownEditorAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeShowMarkDownEditorHandler(
  appObject: HostAppObject
): ShowMarkDownEditorHandler {
  return new ShowMarkDownEditorHandlerImp(appObject);
}

export class ShowMarkDownEditorHandlerImp extends ShowMarkDownEditorHandler {
  private get dialogQueue() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  action: ShowMarkDownEditorAction = (
    actionDTO: ShowMarkDownEditorActionDTO
  ) => {
    const { initialText, submitCallback } = actionDTO;

    const dialogDTO: DialogMarkDownEditorDTO = {
      initialText,
      onConfirm: submitCallback
    };
    const dialog = this.dialogQueue?.markDownDialogFactory(dialogDTO);
    if (dialog) this.dialogQueue?.submitDialog(dialog);
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

  constructor(appObject: HostAppObject) {
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
