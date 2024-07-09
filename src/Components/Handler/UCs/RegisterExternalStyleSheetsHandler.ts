import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { ActionNotImplemented, HostHandlerEntity, RequestHandler, UnableToParsePayload, UnsupportedRequestVersion } from "../Entities";

export type RegisterStylesheetsAction = (stylesheets: string[]) => void;

export abstract class RegisterExternalStyleSheetsHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "RegisterExternalStyleSheetsHandler";

  readonly requestType = "REGISTER_EXTERNAL_STYLESHEETS";

  abstract action: RegisterStylesheetsAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeRegisterExternalStyleSheetsHandler(
  appObject: HostAppObject
): RegisterExternalStyleSheetsHandler {
  return new RegisterExternalStyleSheetsHandlerImp(appObject);
}

class RegisterExternalStyleSheetsHandlerImp extends RegisterExternalStyleSheetsHandler {
  readonly requestType = "REGISTER_EXTERNAL_STYLESHEETS";

  action: RegisterStylesheetsAction = (stylesheets: string[]) => {
    this.log(`Style sheets: ${stylesheets}`)
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { stylesheets } = this.castPayloadV1(payload);
      this.action(stylesheets);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (castPayload.stylesheets === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: HostAppObject) {
    super(appObject, RegisterExternalStyleSheetsHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  stylesheets: string[];
};
