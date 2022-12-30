import { ActionNotImplemented, HostHandler, RequestHandler, UnableToParsePayload, UnsupportedRequestVerion } from '../../Entities';

export type HasPreviousStateAction = (
  callback: (hasNextState: boolean) => void
) => void;

export class HasPreviousStateBase extends RequestHandler {
  readonly requestType = "HAS_PREVIOUS_STATE";

  action: HasPreviousStateAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { callback } = this.castPayloadV1(payload);
      this.action(callback);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (!castPayload.callback) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandler) {
    super();
    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  callback: (hasNextState: boolean) => void;
};
