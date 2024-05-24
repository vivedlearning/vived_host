import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export type OnStateChangeAction = (state: object, assets: string[], validationErrorMessage?: string) => void;

export class OnStateChangeBase implements RequestHandler {
  readonly requestType = 'ON_STATE_CHANGE';

  action: OnStateChangeAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { stateObject } = this.castPayloadV1(payload);
      this.action(stateObject, []);
    } else if (version === 2) {
      const { stateObject, validationErrorMessage } = this.castPayloadV2(payload);
      this.action(stateObject, [], validationErrorMessage);
    } else if (version === 3) {
      const { stateObject, assets, validationErrorMessage } = this.castPayloadV3(payload);
      this.action(stateObject, assets, validationErrorMessage);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(this.requestType, 1, JSON.stringify(payload));
    }

    return castPayload;
  }

  private castPayloadV2(payload: unknown): Payload_V2 {
    const castPayload = payload as Payload_V2;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(this.requestType, 2, JSON.stringify(payload));
    }

    return castPayload;
  }

  private castPayloadV3(payload: unknown): Payload_V3 {
    const castPayload = payload as Payload_V3;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(this.requestType, 3, JSON.stringify(payload));
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandlerX) {
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  stateObject: object;
};

type Payload_V2 = {
  stateObject: object;
  validationErrorMessage?: string;
};

type Payload_V3 = {
  stateObject: object;
  assets: string[];
  validationErrorMessage?: string;
};
