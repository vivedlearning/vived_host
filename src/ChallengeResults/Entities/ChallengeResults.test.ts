import { makeAppObjectRepo } from "@vived/core";
import {
  makeChallengeResults,
  ChallengeResultHitData,
  ChallengeResultMultiHitData,
  ChallengeResultQualityData,
  ChallengeResultScoreData,
  ChallengeResultProgressData,
  ChallengeResultsEntity
} from "./ChallengeResults";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");
  const results = makeChallengeResults(
    appObjects.getOrCreate("ChallengeResults")
  );
  const observer = jest.fn();
  results.addChangeObserver(observer);

  return { results, observer, appObjects, registerSingletonSpy };
}

describe("Results Entity", () => {
  it("Adds a hit results", () => {
    const { results, observer } = makeTestRig();

    expect(results.results).toHaveLength(0);
    results.submitHitResult("slide1", true, 2, "A challenge!");
    expect(results.results).toHaveLength(1);
    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(2);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("HIT");

    const data = result.resultData as ChallengeResultHitData;
    expect(data.success).toEqual(true);

    expect(observer).toBeCalled();
  });

  it("Updates a hit result if that slide result already exists", () => {
    const { results, observer } = makeTestRig();

    results.submitHitResult("slide1", false, 1, "A challenge!");
    expect(results.results).toHaveLength(1);

    results.submitHitResult("slide1", true, 2, "A challenge!");
    expect(results.results).toHaveLength(1);

    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(2);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("HIT");

    const data = result.resultData as ChallengeResultHitData;
    expect(data.success).toEqual(true);

    expect(observer).toBeCalled();
  });

  it("Adds a multi hit results", () => {
    const { results, observer } = makeTestRig();

    expect(results.results).toHaveLength(0);
    results.submitMultiHitResult("slide1", 10, 20, 30, 2, "A challenge!");
    expect(results.results).toHaveLength(1);
    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(2);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("MULTIHIT");

    const data = result.resultData as ChallengeResultMultiHitData;
    expect(data.hits).toEqual(10);
    expect(data.misses).toEqual(20);
    expect(data.unanswered).toEqual(30);

    expect(observer).toBeCalled();
  });

  it("Updates a multi hit result if that slide result already exists", () => {
    const { results, observer } = makeTestRig();

    results.submitMultiHitResult("slide1", 1, 2, 3, 1, "A challenge!");
    expect(results.results).toHaveLength(1);

    results.submitMultiHitResult("slide1", 10, 20, 30, 2, "A challenge!");
    expect(results.results).toHaveLength(1);

    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(2);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("MULTIHIT");

    const data = result.resultData as ChallengeResultMultiHitData;
    expect(data.hits).toEqual(10);
    expect(data.misses).toEqual(20);
    expect(data.unanswered).toEqual(30);

    expect(observer).toBeCalled();
  });

  it("Adds a quality results", () => {
    const { results, observer } = makeTestRig();

    expect(results.results).toHaveLength(0);
    results.submitQualityResult("slide1", 10, 20, 2, "A challenge!");
    expect(results.results).toHaveLength(1);
    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(2);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("QUALITY");

    const data = result.resultData as ChallengeResultQualityData;
    expect(data.stars).toEqual(10);
    expect(data.maxStars).toEqual(20);

    expect(observer).toBeCalled();
  });

  it("Updates a quality result if that slide result already exists", () => {
    const { results, observer } = makeTestRig();

    results.submitQualityResult("slide1", 1, 2, 2, "A challenge!");
    expect(results.results).toHaveLength(1);

    results.submitQualityResult("slide1", 10, 20, 2, "A challenge!");
    expect(results.results).toHaveLength(1);

    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(2);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("QUALITY");

    const data = result.resultData as ChallengeResultQualityData;
    expect(data.stars).toEqual(10);
    expect(data.maxStars).toEqual(20);

    expect(observer).toBeCalled();
  });

  it("Adds a score results", () => {
    const { results, observer } = makeTestRig();

    expect(results.results).toHaveLength(0);
    results.submitScoreResult("slide1", 10, 20, 2, "A challenge!");
    expect(results.results).toHaveLength(1);
    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(2);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("SCORE");

    const data = result.resultData as ChallengeResultScoreData;
    expect(data.score).toEqual(10);
    expect(data.maxScore).toEqual(20);

    expect(observer).toBeCalled();
  });

  it("Updates a score result if that slide result already exists", () => {
    const { results, observer } = makeTestRig();

    results.submitScoreResult("slide1", 1, 2, 2, "A challenge!");
    expect(results.results).toHaveLength(1);

    results.submitScoreResult("slide1", 10, 20, 2, "A challenge!");
    expect(results.results).toHaveLength(1);

    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(2);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("SCORE");

    const data = result.resultData as ChallengeResultScoreData;
    expect(data.score).toEqual(10);
    expect(data.maxScore).toEqual(20);

    expect(observer).toBeCalled();
  });

  it("Gets the result for a slide", () => {
    const { results } = makeTestRig();

    results.submitScoreResult("slide1", 10, 20, 2, "A challenge!");
    results.submitQualityResult("slide2", 1, 2, 2, "A challenge!");
    results.submitMultiHitResult("slide3", 10, 20, 30, 2, "A challenge!");
    results.submitHitResult("slide4", false, 1, "A challenge!");

    const result = results.getResultForSlide("slide1");

    expect(result?.slideID).toEqual("slide1");
    expect(result?.tries).toEqual(2);
    expect(result?.message).toEqual("A challenge!");
    expect(result?.type).toEqual("SCORE");

    const data = result?.resultData as ChallengeResultScoreData;
    expect(data.score).toEqual(10);
    expect(data.maxScore).toEqual(20);
  });

  it("Returns undefined for if there is no result for a slide", () => {
    const { results } = makeTestRig();
    const result = results.getResultForSlide("slide1");

    expect(result).toBeUndefined();
  });

  it("Adds a progress results", () => {
    const { results, observer } = makeTestRig();

    expect(results.results).toHaveLength(0);
    results.submitProgressResult("slide1", 0.5, "A challenge!");
    expect(results.results).toHaveLength(1);
    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(1);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("PROGRESS");

    const data = result.resultData as ChallengeResultProgressData;
    expect(data.maxProgress).toEqual(0.5);

    expect(observer).toBeCalled();
  });

  it("Updates a progress result if that slide result already exists", () => {
    const { results, observer } = makeTestRig();

    results.submitProgressResult("slide1", 0.5, "A challenge!");
    expect(results.results).toHaveLength(1);

    results.submitProgressResult("slide1", 0.75, "A challenge!");
    expect(results.results).toHaveLength(1);

    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(1);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("PROGRESS");

    const data = result.resultData as ChallengeResultProgressData;
    expect(data.maxProgress).toEqual(0.75);

    expect(observer).toBeCalled();
  });

  it("It does not update if the new progress is less than the previous", () => {
    const { results, observer } = makeTestRig();

    results.submitProgressResult("slide1", 0.75, "A challenge!");
    expect(results.results).toHaveLength(1);
    observer.mockClear();

    results.submitProgressResult("slide1", 0.5, "A challenge!");
    expect(results.results).toHaveLength(1);

    const result = results.results[0];

    expect(result.slideID).toEqual("slide1");
    expect(result.tries).toEqual(1);
    expect(result.message).toEqual("A challenge!");
    expect(result.type).toEqual("PROGRESS");

    const data = result.resultData as ChallengeResultProgressData;
    expect(data.maxProgress).toEqual(0.75);

    expect(observer).not.toBeCalled();
  });

  it("Gets the singleton", () => {
    const { appObjects, results } = makeTestRig();

    expect(ChallengeResultsEntity.get(appObjects)).toEqual(results);
  });

  it("Registers as the singleton", () => {
    const { appObjects, results, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(results);
  });

  describe("getScoreForSlide", () => {
    it("returns 0 if slide has no result", () => {
      const { results } = makeTestRig();

      const score = results.getScoreForSlide("non-existent-slide");

      expect(score).toBe(0);
    });

    it("returns 1 for successful HIT result", () => {
      const { results } = makeTestRig();

      results.submitHitResult("slide1", true, 2, "A challenge!");
      const score = results.getScoreForSlide("slide1");

      expect(score).toBe(1);
    });

    it("returns 0 for unsuccessful HIT result", () => {
      const { results } = makeTestRig();

      results.submitHitResult("slide1", false, 2, "A challenge!");
      const score = results.getScoreForSlide("slide1");

      expect(score).toBe(0);
    });

    it("calculates ratio for MULTIHIT result", () => {
      const { results } = makeTestRig();

      results.submitMultiHitResult("slide1", 8, 2, 10, 2, "A challenge!");
      const score = results.getScoreForSlide("slide1");

      // hits / (hits + unanswered) = 8 / (8 + 10) = 8 / 18 = 0.4444...
      expect(score).toBeCloseTo(0.444, 3);
    });

    it("returns 0 for MULTIHIT result with no total answers", () => {
      const { results } = makeTestRig();

      results.submitMultiHitResult("slide1", 0, 0, 0, 2, "A challenge!");
      const score = results.getScoreForSlide("slide1");

      expect(score).toBe(0);
    });

    it("calculates ratio for QUALITY result", () => {
      const { results } = makeTestRig();

      results.submitQualityResult("slide1", 3, 5, 2, "A challenge!");
      const score = results.getScoreForSlide("slide1");

      // stars / maxStars = 3 / 5 = 0.6
      expect(score).toBe(0.6);
    });

    it("returns 0 for QUALITY result with maxStars=0", () => {
      const { results } = makeTestRig();

      results.submitQualityResult("slide1", 0, 0, 2, "A challenge!");
      const score = results.getScoreForSlide("slide1");

      expect(score).toBe(0);
    });

    it("calculates ratio for SCORE result", () => {
      const { results } = makeTestRig();

      results.submitScoreResult("slide1", 80, 100, 2, "A challenge!");
      const score = results.getScoreForSlide("slide1");

      // score / maxScore = 80 / 100 = 0.8
      expect(score).toBe(0.8);
    });

    it("returns 0 for SCORE result with maxScore=0", () => {
      const { results } = makeTestRig();

      results.submitScoreResult("slide1", 0, 0, 2, "A challenge!");
      const score = results.getScoreForSlide("slide1");

      expect(score).toBe(0);
    });

    it("returns maxProgress for PROGRESS result", () => {
      const { results } = makeTestRig();

      results.submitProgressResult("slide1", 0.75, "A challenge!");
      const score = results.getScoreForSlide("slide1");

      expect(score).toBe(0.75);
    });
  });
});
