import { AppObject, AppObjectUC } from "@vived/core";
import { ChallengeResponse } from "../../StateMachine/Entities/HostStateEntity";
import { HostEditingStateEntity } from "../../StateMachine/Entities/HostEditingStateEntity";
import {
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export type OnStateChangeAction = (
  state: object,
  assets: string[],
  validationErrorMessage?: string,
  responseType?: string
) => void;

export abstract class OnStateChangeHandler
  extends AppObjectUC
  implements RequestHandler
{
  static readonly type = "OnStateChangeHandler";

  readonly requestType = "ON_STATE_CHANGE";

  abstract action: OnStateChangeAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeOnStateChangeHandler(
  appObject: AppObject
): OnStateChangeHandler {
  return new OnStateChangeHandlerImp(appObject);
}

export class OnStateChangeHandlerImp extends OnStateChangeHandler {
  private get editStateEntity() {
    return this.getCachedSingleton<HostEditingStateEntity>(
      HostEditingStateEntity.type
    );
  }

  action: OnStateChangeAction = (
    state: object,
    assets: string[],
    validationErrorMessage?: string,
    responseType?: string
  ) => {
    if (!this.editStateEntity) return;

    const editingState = this.editStateEntity.editingState;
    if (!editingState) return;

    editingState.setStateData(state);
    editingState.assets = assets;

    this.editStateEntity.stateValidationMessage = validationErrorMessage;

    if (!responseType) return;

    const response = responseLookupMap.get(responseType.toUpperCase());
    if (!response) {
      this.warn(`Unable to parse ${responseType} into an expected response`);
    }
    editingState.expectedResponse = response;
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const { stateObject } = this.castPayloadV1(payload);
      this.action(stateObject, []);
    } else if (version === 2) {
      const { stateObject, validationErrorMessage } =
        this.castPayloadV2(payload);
      this.action(stateObject, [], validationErrorMessage);
    } else if (version === 3) {
      const { stateObject, assets, validationErrorMessage } =
        this.castPayloadV3(payload);
      this.action(stateObject, assets, validationErrorMessage);
    } else if (version === 4) {
      const { stateObject, assets, validationErrorMessage, responseType } =
        this.castPayloadV4(payload);
      this.action(stateObject, assets, validationErrorMessage, responseType);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): Payload_V1 {
    const castPayload = payload as Payload_V1;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  private castPayloadV2(payload: unknown): Payload_V2 {
    const castPayload = payload as Payload_V2;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        2,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  private castPayloadV3(payload: unknown): Payload_V3 {
    const castPayload = payload as Payload_V3;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        3,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  private castPayloadV4(payload: unknown): Payload_V4 {
    const castPayload = payload as Payload_V4;
    if (castPayload.stateObject === undefined) {
      throw new UnableToParsePayload(
        this.requestType,
        3,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(appObject: AppObject) {
    super(appObject, OnStateChangeHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

const responseLookupMap = new Map<string, ChallengeResponse>([
  ["HIT", ChallengeResponse.HIT],
  ["MULTIHIT", ChallengeResponse.MULTIHIT],
  ["NONE", ChallengeResponse.NONE],
  ["PROGRESS", ChallengeResponse.PROGRESS],
  ["QUALITY", ChallengeResponse.QUALITY],
  ["SCORE", ChallengeResponse.SCORE]
]);

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

type Payload_V4 = {
  stateObject: object;
  assets: string[];
  validationErrorMessage?: string;
  responseType: string;
};
