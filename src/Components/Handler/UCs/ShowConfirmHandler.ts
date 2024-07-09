import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { DialogConfirmDTO, DialogQueue } from "../../Dialog";
import {
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export interface ShowConfirmActionDTO {
  title: string;
  message: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  confirmCallback: () => void;
  cancelCallback: () => void;
}

export type ShowConfirmAction = (confirmData: ShowConfirmActionDTO) => void;

export abstract class ShowConfirmHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "ShowConfirmHandler";

  readonly requestType = "SHOW_CONFIRM";

  abstract action: ShowConfirmAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeShowConfirmHandler(
  appObject: HostAppObject
): ShowConfirmHandler {
  return new ShowConfirmHandlerImp(appObject);
}

class ShowConfirmHandlerImp extends ShowConfirmHandler {
  private get dialogQueue() {
    return this.getCachedSingleton<DialogQueue>(DialogQueue.type);
  }

  action: ShowConfirmAction = (actionDTO: ShowConfirmActionDTO) => {
    const {
      cancelButtonLabel,
      cancelCallback,
      confirmButtonLabel,
      confirmCallback,
      message,
      title
    } = actionDTO;

    const dialogDTO: DialogConfirmDTO = {
      cancelButtonLabel,
      confirmButtonLabel,
      message,
      title,
      onCancel: cancelCallback,
      onConfirm: confirmCallback
    };
    const confirmDialog = this.dialogQueue?.confirmDialogFactory(dialogDTO);
    if (confirmDialog) this.dialogQueue?.submitDialog(confirmDialog);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const castPayload = this.castPayloadV1(payload);
      this.action(castPayload);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): ShowConfirmActionDTO {
    const castPayload = payload as Payload_V1;
    if (
      castPayload.title === undefined ||
      castPayload.message === undefined ||
      castPayload.confirmButtonLabel === undefined ||
      castPayload.cancelButtonLabel === undefined ||
      castPayload.confirmCallback === undefined ||
      castPayload.cancelCallback === undefined
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
    super(appObject, ShowConfirmHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  title: string;
  message: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
  confirmCallback: () => void;
  cancelCallback: () => void;
};
