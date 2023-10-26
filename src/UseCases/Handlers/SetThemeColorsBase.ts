import {
  ActionNotImplemented,
  HostHandler,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVerion,
} from '../../Entities';

export interface SetThemeColorsDTO {
  colors: object;
}

export type SetThemeColorsAction = (colors: SetThemeColorsDTO) => void;

export class SetThemeColorsBase extends RequestHandler {
  readonly requestType = 'SET_THEME_COLORS';
  readonly payloadVersion = 1;

  action: SetThemeColorsAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const castPayload = this.castPayloadV1(payload);
      this.action(castPayload);
    } else {
      throw new UnsupportedRequestVerion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): SetThemeColorsDTO {
    const castPayload = payload as Payload_V1;
    if (castPayload.colors === undefined) {
      throw new UnableToParsePayload(this.requestType, 1, JSON.stringify(payload));
    }

    return castPayload;
  }

  constructor(handler: HostHandler) {
    super();
    handler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  colors: object;
};
