import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeChallengeResults } from "../../ChallengeResults";
import {
  makeHostStateMachine,
  makeMockHostStateEntity
} from "../../StateMachine";
import { makeHostHandlerEntity } from "../Entities";
import {
  makeSubmitResultHandler,
  MultiHitResultV1
} from "./SubmitResultHandler";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const ao = appObjects.getOrCreate("AO");
  const handler = makeHostHandlerEntity(ao);
  const registerSpy = jest.spyOn(handler, "registerRequestHandler");

  const results = makeChallengeResults(appObjects.getOrCreate("Results"));
  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);
  stateMachine.setActiveStateByID("state1");

  const mockWarn = jest.fn();
  appObjects.submitWarning = mockWarn;

  const uc = makeSubmitResultHandler(ao);
  return { registerSpy, uc, results, stateMachine, mockWarn };
}

describe("Submit Result Base Handler", () => {
  it("Registers as a handler when constructed", () => {
    const { registerSpy, uc } = makeTestRig();
    expect(registerSpy).toBeCalledWith(uc);
  });

  it("Throws an unsupported error for version 1", () => {
    const { uc } = makeTestRig();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(1, payload)).toThrowError();
  });

  it("Triggers the action for v2", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const result: MultiHitResultV1 = {
      hits: 1,
      misses: 2,
      unanswered: 3
    };

    const payload = {
      tries: 5,
      description: "A Question!",
      result,
      resultType: "MULTIHIT_V1"
    };

    uc.handleRequest(2, payload);

    expect(uc.action).toBeCalledWith("MULTIHIT_V1", result, "A Question!");
  });

  it("Triggers the action for v3", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const result: MultiHitResultV1 = {
      hits: 1,
      misses: 2,
      unanswered: 3
    };

    const payload = {
      description: "A Question!",
      result,
      resultType: "MULTIHIT_V1"
    };

    uc.handleRequest(3, payload);

    expect(uc.action).toBeCalledWith("MULTIHIT_V1", result, "A Question!");
  });

  it("Throws for an unsupported version", () => {
    const { uc } = makeTestRig();

    const mockCallback = jest.fn();
    const payload = {
      assetID: "anAsset",
      callback: mockCallback
    };

    expect(() => uc.handleRequest(-1, payload)).toThrowError();
  });

  it("Throws if the v2 payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(2, payload)).toThrowError();
  });

  it("Throws if the v3 payload is bungled", () => {
    const { uc } = makeTestRig();
    uc.action = jest.fn();

    const payload = {
      foo: "bar"
    };

    expect(() => uc.handleRequest(3, payload)).toThrowError();
  });

  it("Submits a hit with the current slide", () => {
    const { uc, results } = makeTestRig();
    const mockSubmit = jest.fn();
    results.submitHitResult = mockSubmit;

    uc.action("HIT_V1", { success: true }, "A question!");

    expect(mockSubmit).toBeCalledWith("state1", true, 1, "A question!");
  });

  it("Does not submit if there is no active slide", () => {
    const { uc, results, stateMachine } = makeTestRig();
    stateMachine.clearActiveState();

    const mockSubmit = jest.fn();
    results.submitHitResult = mockSubmit;

    uc.action("HIT_V1", { success: true }, "A question!");

    expect(mockSubmit).not.toBeCalled();
  });

  it("Warns if there is no active slide", () => {
    const { uc, stateMachine, mockWarn } = makeTestRig();

    stateMachine.clearActiveState();
    uc.action("HIT_V1", { success: true }, "A question!");

    expect(mockWarn).toBeCalled();
  });

  it("Bumps the tries", () => {
    const { uc, results } = makeTestRig();
    uc.action("HIT_V1", { success: true }, "A question!");
    uc.action("HIT_V1", { success: true }, "A question!");

    const mockSubmit = jest.fn();
    results.submitHitResult = mockSubmit;
    uc.action("HIT_V1", { success: true }, "A question!");

    expect(mockSubmit).toBeCalledWith("state1", true, 3, "A question!");
  });

  it("Does not submit a hit if the payload is wrong", () => {
    const { uc, results } = makeTestRig();

    const mockSubmit = jest.fn();
    results.submitHitResult = mockSubmit;

    uc.action("HIT_V1", { stars: 1, maxStars: 5 }, "A question!");

    expect(mockSubmit).not.toBeCalled();
  });

  it("Warns if the hit the payload is wrong", () => {
    const { uc, mockWarn } = makeTestRig();

    uc.action("HIT_V1", { stars: 1, maxStars: 5 }, "A question!");

    expect(mockWarn).toBeCalled();
  });

  it("Submits a multi-hit with the current slide", () => {
    const { uc, results } = makeTestRig();
    const mockSubmit = jest.fn();
    results.submitMultiHitResult = mockSubmit;

    uc.action(
      "MULTIHIT_V1",
      { hits: 5, misses: 6, unanswered: 7 },
      "A question!"
    );

    expect(mockSubmit).toBeCalledWith("state1", 5, 6, 7, 1, "A question!");
  });

  it("Does not submit a multi hit if the payload is wrong", () => {
    const { uc, results } = makeTestRig();

    const mockSubmit = jest.fn();
    results.submitMultiHitResult = mockSubmit;

    uc.action("MULTIHIT_V1", { stars: 1, maxStars: 5 }, "A question!");

    expect(mockSubmit).not.toBeCalled();
  });

  it("Warns if the multi hit payload is wrong", () => {
    const { uc, mockWarn } = makeTestRig();

    uc.action("MULTIHIT_V1", { stars: 1, maxStars: 5 }, "A question!");

    expect(mockWarn).toBeCalled();
  });

  it("Submits a quality result with the current slide", () => {
    const { uc, results } = makeTestRig();
    const mockSubmit = jest.fn();
    results.submitQualityResult = mockSubmit;

    uc.action("QUALITY_V1", { stars: 3, maxStars: 5 }, "A question!");

    expect(mockSubmit).toBeCalledWith("state1", 3, 5, 1, "A question!");
  });

  it("Does not submit a quality result if the payload is wrong", () => {
    const { uc, results } = makeTestRig();

    const mockSubmit = jest.fn();
    results.submitQualityResult = mockSubmit;

    uc.action(
      "QUALITY_V1",
      { hits: 5, misses: 6, unanswered: 7 },
      "A question!"
    );

    expect(mockSubmit).not.toBeCalled();
  });

  it("Warns if the quality result payload is wrong", () => {
    const { uc, mockWarn } = makeTestRig();

    uc.action(
      "QUALITY_V1",
      { hits: 5, misses: 6, unanswered: 7 },
      "A question!"
    );

    expect(mockWarn).toBeCalled();
  });

  it("Submits a score result with the current slide", () => {
    const { uc, results } = makeTestRig();
    const mockSubmit = jest.fn();
    results.submitScoreResult = mockSubmit;

    uc.action("SCORE_V1", { score: 3, maxScore: 5 }, "A question!");

    expect(mockSubmit).toBeCalledWith("state1", 3, 5, 1, "A question!");
  });

  it("Does not submit a score result if the payload is wrong", () => {
    const { uc, results } = makeTestRig();

    const mockSubmit = jest.fn();
    results.submitScoreResult = mockSubmit;

    uc.action("SCORE_V1", { hits: 5, misses: 6, unanswered: 7 }, "A question!");

    expect(mockSubmit).not.toBeCalled();
  });

  it("Warns if the score result payload is wrong", () => {
    const { uc, mockWarn } = makeTestRig();

    uc.action("SCORE_V1", { hits: 5, misses: 6, unanswered: 7 }, "A question!");

    expect(mockWarn).toBeCalled();
  });

  it("Submits a progress result with the current slide", () => {
    const { uc, results } = makeTestRig();
    const mockSubmit = jest.fn();
    results.submitProgressResult = mockSubmit;

    uc.action("PROGRESS_V1", { progress: 0.75 }, "A question!");

    expect(mockSubmit).toBeCalledWith("state1", 0.75, "A question!");
  });

  it("Does not submit a progress if the payload is wrong", () => {
    const { uc, results } = makeTestRig();

    const mockSubmit = jest.fn();
    results.submitProgressResult = mockSubmit;

    uc.action("PROGRESS_V1", { stars: 1, maxStars: 5 }, "A question!");

    expect(mockSubmit).not.toBeCalled();
  });

  it("Doesn't bump the tries", () => {
    const { uc, results } = makeTestRig();
    uc.action("HIT_V1", { success: true }, "A question!");
    uc.action("HIT_V1", { success: true }, "A question!");

    const mockSubmit = jest.fn();
    results.submitHitResult = mockSubmit;
    uc.action("HIT_V1", { success: true }, "A question!");

    expect(mockSubmit).toBeCalledWith("state1", true, 3, "A question!");

    uc.action("PROGRESS_V1", { progress: 50 }, "A question!");

    expect(mockSubmit).toBeCalledWith("state1", true, 3, "A question!");
  });
});
