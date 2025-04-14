import {
  getSingletonComponent,
  AppObject,
  AppObjectEntity,
  AppObjectRepo
} from "@vived/core";

export type ChallengeResultType =
  | "HIT"
  | "MULTIHIT"
  | "QUALITY"
  | "SCORE"
  | "PROGRESS";

export interface ChallengeResult {
  slideID: string;
  tries: number;
  message: string;
  type: ChallengeResultType;
  resultData:
    | ChallengeResultHitData
    | ChallengeResultMultiHitData
    | ChallengeResultQualityData
    | ChallengeResultScoreData
    | ChallengeResultProgressData;
}

export interface ChallengeResultHitData {
  success: boolean;
}

export interface ChallengeResultProgressData {
  maxProgress: number;
}

export interface ChallengeResultMultiHitData {
  hits: number;
  misses: number;
  unanswered: number;
}

export interface ChallengeResultQualityData {
  stars: number;
  maxStars: number;
}

export interface ChallengeResultScoreData {
  score: number;
  maxScore: number;
}

export abstract class ChallengeResultsEntity extends AppObjectEntity {
  static type = "ChallengeResultsEntity";

  abstract get results(): ChallengeResult[];
  abstract submitHitResult: (
    slideID: string,
    success: boolean,
    tries: number,
    message: string
  ) => void;

  abstract submitMultiHitResult: (
    slideID: string,
    hits: number,
    misses: number,
    unanswered: number,
    tries: number,
    message: string
  ) => void;

  abstract submitQualityResult: (
    slideID: string,
    stars: number,
    maxStars: number,
    tries: number,
    message: string
  ) => void;

  abstract submitScoreResult: (
    slideID: string,
    score: number,
    maxScore: number,
    tries: number,
    message: string
  ) => void;

  abstract submitProgressResult: (
    slideID: string,
    maxProgress: number,
    message: string
  ) => void;

  abstract getResultForSlide: (slideID: string) => ChallengeResult | undefined;

  abstract getScoreForSlide: (slideID: string) => number;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ChallengeResultsEntity>(
      ChallengeResultsEntity.type,
      appObjects
    );
  }
}

export function makeChallengeResults(
  appObject: AppObject
): ChallengeResultsEntity {
  return new ChallengeResultsImp(appObject);
}

class ChallengeResultsImp extends ChallengeResultsEntity {
  private resultLookup = new Map<string, ChallengeResult>();

  get results(): ChallengeResult[] {
    return Array.from(this.resultLookup.values());
  }

  submitHitResult = (
    slideID: string,
    success: boolean,
    tries: number,
    message: string
  ): void => {
    const resultData: ChallengeResultHitData = {
      success
    };
    const result: ChallengeResult = {
      slideID,
      message,
      resultData,
      tries,
      type: "HIT"
    };

    this.resultLookup.set(slideID, result);
    this.notifyOnChange();
  };

  submitMultiHitResult = (
    slideID: string,
    hits: number,
    misses: number,
    unanswered: number,
    tries: number,
    message: string
  ): void => {
    const resultData: ChallengeResultMultiHitData = {
      hits,
      misses,
      unanswered
    };
    const result: ChallengeResult = {
      slideID,
      message,
      resultData,
      tries,
      type: "MULTIHIT"
    };

    this.resultLookup.set(slideID, result);
    this.notifyOnChange();
  };

  submitQualityResult = (
    slideID: string,
    stars: number,
    maxStars: number,
    tries: number,
    message: string
  ): void => {
    const resultData: ChallengeResultQualityData = {
      stars,
      maxStars
    };
    const result: ChallengeResult = {
      slideID,
      message,
      resultData,
      tries,
      type: "QUALITY"
    };

    this.resultLookup.set(slideID, result);
    this.notifyOnChange();
  };

  submitScoreResult = (
    slideID: string,
    score: number,
    maxScore: number,
    tries: number,
    message: string
  ): void => {
    const resultData: ChallengeResultScoreData = {
      score,
      maxScore
    };
    const result: ChallengeResult = {
      slideID,
      message,
      resultData,
      tries,
      type: "SCORE"
    };

    this.resultLookup.set(slideID, result);
    this.notifyOnChange();
  };

  getResultForSlide = (slideID: string): ChallengeResult | undefined => {
    return this.resultLookup.get(slideID);
  };

  getScoreForSlide = (slideID: string): number => {
    const result = this.getResultForSlide(slideID);
    if (!result) {
      return 0;
    }

    switch (result.type) {
      case "HIT": {
        const hitData = result.resultData as ChallengeResultHitData;
        return hitData.success ? 1 : 0;
      }
      case "MULTIHIT": {
        const multiHitData = result.resultData as ChallengeResultMultiHitData;
        const total = multiHitData.hits + multiHitData.unanswered;
        return total > 0 ? multiHitData.hits / total : 0;
      }
      case "QUALITY": {
        const qualityData = result.resultData as ChallengeResultQualityData;
        return qualityData.maxStars > 0
          ? qualityData.stars / qualityData.maxStars
          : 0;
      }
      case "SCORE": {
        const scoreData = result.resultData as ChallengeResultScoreData;
        return scoreData.maxScore > 0
          ? scoreData.score / scoreData.maxScore
          : 0;
      }
      case "PROGRESS": {
        const progressData = result.resultData as ChallengeResultProgressData;
        return progressData.maxProgress;
      }
      default:
        return 0;
    }
  };

  submitProgressResult = (
    slideID: string,
    maxProgress: number,
    message: string
  ): void => {
    const currentResult = this.getResultForSlide(slideID);
    if (
      currentResult &&
      (currentResult.resultData as ChallengeResultProgressData).maxProgress >
        maxProgress
    ) {
      return;
    }

    const resultData: ChallengeResultProgressData = {
      maxProgress
    };
    const result: ChallengeResult = {
      slideID,
      message,
      resultData,
      tries: 1,
      type: "PROGRESS"
    };

    this.resultLookup.set(slideID, result);
    this.notifyOnChange();
  };

  constructor(appObject: AppObject) {
    super(appObject, ChallengeResultsEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
