import { makeChallengeResults, ChallengeResultHitData, ChallengeResultMultiHitData, ChallengeResultQualityData, ChallengeResultScoreData } from "./ChallengeResults";

function makeTestRig() {
  const results = makeChallengeResults();
  const observer = jest.fn();
  results.addObserver(observer);

  return {results, observer}
}

describe("Results Entity", ()=>{
  it("Adds a hit results", ()=>{
    const {results, observer} = makeTestRig();

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

  it("Updates a hit result if that slide result already exists", ()=>{
    const {results, observer} = makeTestRig();

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
  })

  it("Adds a multi hit results", ()=>{
    const {results, observer} = makeTestRig();

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

  it("Updates a multi hit result if that slide result already exists", ()=>{
    const {results, observer} = makeTestRig();

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
  })

  it("Adds a quality results", ()=>{
    const {results, observer} = makeTestRig();

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

  it("Updates a quality result if that slide result already exists", ()=>{
    const {results, observer} = makeTestRig();

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
  })

  
  it("Adds a score results", ()=>{
    const {results, observer} = makeTestRig();

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

  it("Updates a score result if that slide result already exists", ()=>{
    const {results, observer} = makeTestRig();

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
  })

  it("Gets the result for a slide", ()=>{
    const {results} = makeTestRig();

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
  })

  it("Returns undefined for if there is no result for a slide", ()=>{
    const {results} = makeTestRig();
    const result = results.getResultForSlide("slide1");

    expect(result).toBeUndefined();
  })

  it("Allows an observer to be removed", ()=>{
    const {results, observer} = makeTestRig();
    results.removeObserver(observer);

    results.submitScoreResult("slide1", 10, 20, 2, "A challenge!");
    results.submitQualityResult("slide2", 1, 2, 2, "A challenge!");
    results.submitMultiHitResult("slide3", 10, 20, 30, 2, "A challenge!");
    results.submitHitResult("slide4", false, 1, "A challenge!");

    expect(observer).not.toBeCalled();
  })
})