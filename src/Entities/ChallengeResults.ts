import { ObserverList } from "./ObserverList";

export type OnChallengeResultsChange = () => void;

export type ChallengeResultType = "HIT" | "MULTIHIT" | "QUALITY" | "SCORE";

export interface ChallengeResult {
  slideID: string;
  tries: number;
  message: string;
  type: ChallengeResultType;
  resultData:
    | ChallengeResultHitData
    | ChallengeResultMultiHitData
    | ChallengeResultQualityData
    | ChallengeResultScoreData;
}

export interface ChallengeResultHitData {
  success: boolean;
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

export interface ChallengeResults {
  results: ChallengeResult[];
  submitHitResult: (
    slideID: string,
    success: boolean,
    tries: number,
    message: string
  ) => void;
  submitMultiHitResult: (
    slideID: string,
    hits: number,
    misses: number,
    unanswered: number,
    tries: number,
    message: string
  ) => void;
  submitQualityResult: (
    slideID: string,
    stars: number,
    maxStars: number,
    tries: number,
    message: string
  ) => void;
  submitScoreResult: (
    slideID: string,
    score: number,
    maxScore: number,
    tries: number,
    message: string
  ) => void;
  getResultForSlide: (slideID: string) => ChallengeResult | undefined;

  addObserver: (observer: OnChallengeResultsChange) => void;
  removeObserver: (observer: OnChallengeResultsChange) => void;
}

export function makeChallengeResults(): ChallengeResults {
  return new ChallengeResultsImp();
}

class ChallengeResultsImp implements ChallengeResults {
  private observers = new ObserverList<void>();

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
      success,
    };
    const result: ChallengeResult = {
      slideID,
      message,
      resultData,
      tries,
      type: "HIT",
    };

    this.resultLookup.set(slideID, result);
    this.observers.notify();
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
      unanswered,
    };
    const result: ChallengeResult = {
      slideID,
      message,
      resultData,
      tries,
      type: "MULTIHIT",
    };

    this.resultLookup.set(slideID, result);
    this.observers.notify();
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
      maxStars,
    };
    const result: ChallengeResult = {
      slideID,
      message,
      resultData,
      tries,
      type: "QUALITY",
    };

    this.resultLookup.set(slideID, result);
    this.observers.notify();
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
      maxScore,
    };
    const result: ChallengeResult = {
      slideID,
      message,
      resultData,
      tries,
      type: "SCORE",
    };

    this.resultLookup.set(slideID, result);
    this.observers.notify();
  };

  getResultForSlide = (slideID: string): ChallengeResult | undefined => {
    return this.resultLookup.get(slideID);
  };

  addObserver = (observer: OnChallengeResultsChange): void => {
    this.observers.add(observer);
  };
  
  removeObserver = (observer: OnChallengeResultsChange): void => {
    this.observers.remove(observer);
  };
}
