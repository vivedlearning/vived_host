import { AppObject, AppObjectUC } from "@vived/core";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

export interface IsAssetFetchedActionDTO {
  assetId: string;
  callback: (isFetched: boolean) => void;
}

export type IsAssetFetchedAction = (
  confirmData: IsAssetFetchedActionDTO
) => void;

export abstract class IsAssetFetchedHandler
  extends AppObjectUC
  implements RequestHandler
{
  static readonly type = "IsAssetFetchedHandler";

  readonly requestType = "IS_ASSET_FILE_FETCHED";

  abstract action: IsAssetFetchedAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeIsAssetFetchedHandler(
  appObject: AppObject
): IsAssetFetchedHandler {
  return new IsAssetFetchedHandlerImp(appObject);
}

class IsAssetFetchedHandlerImp extends IsAssetFetchedHandler {
  action: IsAssetFetchedAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 1) {
      const castPayload = this.castPayloadV1(payload);
      this.action(castPayload);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV1(payload: unknown): IsAssetFetchedActionDTO {
    const castPayload = payload as Payload_V1;
    if (
      castPayload.assetId === undefined ||
      castPayload.callback === undefined
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
    super(appObject, IsAssetFetchedHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

    hostHandler.registerRequestHandler(this);
  }
}

type Payload_V1 = {
  assetId: string;
  callback: (isFetched: boolean) => void;
};
