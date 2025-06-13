import { AppObject, AppObjectUC } from "@vived/core";
import { MakeAlertDialogUC } from "../../Dialog";
import {
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export interface ShowAlertActionDTO {
  title: string;
  message: string;
  closeButtonLabel: string;
  closeCallback: () => void;
}

export type ShowAlertAction = (actionDTO: ShowAlertActionDTO) => void;

export abstract class ShowAlertHandler
  extends AppObjectUC
  implements RequestHandler
{
  static readonly type = "ShowAlertHandler";

  readonly requestType = "SHOW_ALERT";

  abstract action: ShowAlertAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeShowAlertHandler(appObject: AppObject): ShowAlertHandler {
  return new ShowAlertHandlerImp(appObject);
}

class ShowAlertHandlerImp extends ShowAlertHandler {
  action: ShowAlertAction = (actionDTO: ShowAlertActionDTO) => {
    const { closeButtonLabel, closeCallback, message, title } = actionDTO;

    MakeAlertDialogUC.make(
      {
        buttonLabel: closeButtonLabel,
        message,
        title,
        onClose: closeCallback
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

  private castPayloadV1(payload: unknown): ShowAlertActionDTO {
    const castPayload = payload as Payload_V1;
    if (
      castPayload.title === undefined ||
      castPayload.message === undefined ||
      castPayload.closeButtonLabel === undefined ||
      castPayload.closeCallback === undefined
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
    super(appObject, ShowAlertHandler.type);

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
  closeButtonLabel: string;
  closeCallback: () => void;
};
