import {
  ActionNotImplemented,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../../Components";
import { HostHandlerX } from "../../Entities";

export type ResultType =
  | "HIT_V1"
  | "MULTIHIT_V1"
  | "QUALITY_V1"
  | "SCORE_V1"
  | "PROGRESS_V1";
export type Results =
  | HitResultV1
  | MultiHitResultV1
  | QualityResultV1
  | ScoreResultV1
  | ProgressResultV1;

export type HitResultV1 = {
  success: boolean;
};

export type MultiHitResultV1 = {
  hits: number;
  misses: number;
  unanswered: number;
};

export type QualityResultV1 = {
  stars: number;
  maxStars: number;
};

export type ScoreResultV1 = {
  score: number;
  maxScore: number;
};

export type ProgressResultV1 = {
  progress: number;
};

export type SubmitResultAction = (
  type: ResultType,
  result: Results,
  description: string
) => void;

export class SubmitResultBase implements RequestHandler {
  readonly requestType = "SUBMIT_RESULTS";

  action: SubmitResultAction = () => {
    throw new ActionNotImplemented(this.requestType);
  };

  handleRequest = (version: number, payload: unknown) => {
    if (version === 2) {
      const { description, result, resultType } = this.castPayloadV2(payload);
      this.action(resultType, result, description);
    } else if (version === 3) {
      const { description, result, resultType } = this.castPayloadV3(payload);
      this.action(resultType, result, description);
    } else {
      throw new UnsupportedRequestVersion(this.requestType, version);
    }
  };

  private castPayloadV2(payload: unknown): Payload_V2 {
    const castPayload = payload as Payload_V2;
    if (
      castPayload.result === undefined ||
      castPayload.resultType === undefined
    ) {
      throw new UnableToParsePayload(
        this.requestType,
        1,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  private castPayloadV3(payload: unknown): Payload_V3 {
    const castPayload = payload as Payload_V3;
    if (
      castPayload.result === undefined ||
      castPayload.resultType === undefined
    ) {
      throw new UnableToParsePayload(
        this.requestType,
        2,
        JSON.stringify(payload)
      );
    }

    return castPayload;
  }

  constructor(hostHandler: HostHandlerX) {
    hostHandler.registerRequestHandler(this);
  }
}

// Payload V1 is unsupported

type Payload_V2 = {
  tries: number;
  description: string;
  result: Results;
  resultType: ResultType;
};

type Payload_V3 = {
  description: string;
  result: Results;
  resultType: ResultType;
};
