import { HostAppObject, HostAppObjectUC } from "../../../HostAppObject";
import { ChallengeResultsEntity } from "../../ChallengeResults";
import { HostStateMachine } from "../../StateMachine";
import {
  ActionNotImplemented,
  HostHandlerEntity,
  RequestHandler,
  UnableToParsePayload,
  UnsupportedRequestVersion
} from "../Entities";

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

export abstract class SubmitResultHandler
  extends HostAppObjectUC
  implements RequestHandler {
  static readonly type = "SubmitResultHandler";

  readonly requestType = "SUBMIT_RESULTS";

  abstract action: SubmitResultAction;
  abstract handleRequest: (version: number, payload?: unknown) => void;
}

export function makeSubmitResultHandler(
  appObject: HostAppObject
): SubmitResultHandler {
  return new SubmitResultHandlerImp(appObject);
}

class SubmitResultHandlerImp extends SubmitResultHandler {
  private get challengeResults() {
    return this.getCachedSingleton<ChallengeResultsEntity>(
      ChallengeResultsEntity.type
    );
  }

  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  action = (type: ResultType, result: Results, description: string) => {
    if (!this.challengeResults || !this.stateMachine) {
      this.error("Missing Component");
      return;
    }

    if (this.stateMachine.activeState === undefined) {
      this.warn("Cannot store result because there is no active slide");
      return;
    }

    const currentSlide = this.stateMachine.activeState;

    let tries =
      this.challengeResults.getResultForSlide(currentSlide)?.tries ?? 0;
    if (type !== "PROGRESS_V1") {
      tries += 1;
    }

    if (type === "HIT_V1") {
      this.handleHitV1(result as HitResultV1, tries, currentSlide, description);
    } else if (type === "MULTIHIT_V1") {
      this.handleMultiHitV1(
        result as MultiHitResultV1,
        tries,
        currentSlide,
        description
      );
    } else if (type === "QUALITY_V1") {
      this.handleQualityV1(
        result as QualityResultV1,
        tries,
        currentSlide,
        description
      );
    } else if (type === "SCORE_V1") {
      this.handleScoreV1(
        result as ScoreResultV1,
        tries,
        currentSlide,
        description
      );
    } else if (type === "PROGRESS_V1") {
      this.handleProgressV1(
        result as ProgressResultV1,
        currentSlide,
        description
      );
    }
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

  private handleHitV1(
    result: HitResultV1,
    tries: number,
    slideId: string,
    message: string
  ) {
    const castResult = result;

    if (castResult.success === undefined) {
      this.warn(
        `Cannot parse Hit Result V1 payload: ${JSON.stringify(result)}`
      );
      return;
    }

    this.challengeResults?.submitHitResult(
      slideId,
      castResult.success,
      tries,
      message
    );
  }

  private handleProgressV1(
    result: ProgressResultV1,
    slideId: string,
    message: string
  ) {
    const castResult = result;

    if (castResult.progress === undefined) {
      this.warn(
        `Cannot parse Progress Result V1 payload: ${JSON.stringify(result)}`
      );
      return;
    }

    this.challengeResults?.submitProgressResult(
      slideId,
      castResult.progress,
      message
    );
  }

  private handleMultiHitV1(
    result: MultiHitResultV1,
    tries: number,
    slideId: string,
    message: string
  ) {
    const { hits, misses, unanswered } = result;

    if (
      hits === undefined ||
      misses === undefined ||
      unanswered === undefined
    ) {
      this.warn(
        `Cannot parse Multi Hit Result V1 payload: ${JSON.stringify(result)}`
      );
      return;
    }

    this.challengeResults?.submitMultiHitResult(
      slideId,
      hits,
      misses,
      unanswered,
      tries,
      message
    );
  }

  private handleQualityV1(
    result: QualityResultV1,
    tries: number,
    slideId: string,
    message: string
  ) {
    const { maxStars, stars } = result;

    if (maxStars === undefined || stars === undefined) {
      this.warn(
        `Cannot parse Quality Result V1 payload: ${JSON.stringify(result)}`
      );
      return;
    }

    this.challengeResults?.submitQualityResult(
      slideId,
      stars,
      maxStars,
      tries,
      message
    );
  }

  private handleScoreV1(
    result: ScoreResultV1,
    tries: number,
    slideId: string,
    message: string
  ) {
    const { score, maxScore } = result;

    if (maxScore === undefined || score === undefined) {
      this.warn(
        `Cannot parse Score Result V1 payload: ${JSON.stringify(result)}`
      );
      return;
    }

    this.challengeResults?.submitScoreResult(
      slideId,
      score,
      maxScore,
      tries,
      message
    );
  }

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

  constructor(appObject: HostAppObject) {
    super(appObject, SubmitResultHandler.type);

    const hostHandler = HostHandlerEntity.get(appObject);
    if (!hostHandler) {
      this.error("UC added to an entity that does not have HostHandlerEntity");
      return;
    }

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
