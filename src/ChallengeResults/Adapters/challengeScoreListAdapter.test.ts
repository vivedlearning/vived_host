import { AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { makeMockChallengeScoreListPM } from "../Mocks/MockChallengeScoreListPM";
import { challengeScoreListAdapter } from "./challengeScoreListAdapter";

describe("Challenge Score List Adapter", () => {
  let appObjects: AppObjectRepo;
  const setVM = jest.fn();

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    setVM.mockClear();
  });

  it("has empty array as default VM", () => {
    expect(challengeScoreListAdapter.defaultVM).toEqual([]);
  });

  it("adds a view on subscribe", () => {
    const mockPM = makeMockChallengeScoreListPM(appObjects);
    const addViewSpy = jest.spyOn(mockPM, "addView");

    challengeScoreListAdapter.subscribe(appObjects, setVM);

    expect(addViewSpy).toHaveBeenCalledWith(setVM);
  });

  it("handles missing PM on subscribe", () => {
    // No PM created, so it should be missing
    appObjects.submitError = jest.fn();
    appObjects.submitWarning = jest.fn();

    challengeScoreListAdapter.subscribe(appObjects, setVM);

    expect(appObjects.submitError).toHaveBeenCalledWith(
      "challengeScoreListAdapter",
      "Unable to find ChallengeScoreListPM"
    );
  });

  it("removes a view on unsubscribe", () => {
    const mockPM = makeMockChallengeScoreListPM(appObjects);
    const removeViewSpy = jest.spyOn(mockPM, "removeView");

    challengeScoreListAdapter.unsubscribe(appObjects, setVM);

    expect(removeViewSpy).toHaveBeenCalledWith(setVM);
  });
});
