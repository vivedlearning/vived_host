import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { HostStatePM } from "../PMs/HostStatePM";
import { hostStateAdapter } from "./hostStateAdapter";
import { MockHostStatePM, makeMockHostStatePM } from "../Mocks/MockHostStatePM";

describe("hostStateAdapter", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let mockPM: MockHostStatePM;
  const testId = "test-state-id";
  const setVM = jest.fn();

  beforeEach(() => {
    appObjects = makeAppObjectRepo();
    appObject = appObjects.getOrCreate(testId);

    // Create the mock PM instead of a real one
    mockPM = makeMockHostStatePM(appObject);

    // Reset the mock function before each test
    setVM.mockReset();
  });

  it("should provide the default VM from HostStatePM", () => {
    expect(hostStateAdapter.defaultVM).toEqual(HostStatePM.defaultVM);
  });

  it("should add a view on subscribe", () => {
    const addViewSpy = jest.spyOn(mockPM, "addView");

    hostStateAdapter.subscribe(testId, appObjects, setVM);

    expect(addViewSpy).toHaveBeenCalledWith(setVM);
  });

  it("should remove a view on unsubscribe", () => {
    const removeViewSpy = jest.spyOn(mockPM, "removeView");

    hostStateAdapter.unsubscribe(testId, appObjects, setVM);

    expect(removeViewSpy).toHaveBeenCalledWith(setVM);
  });

  it("should handle missing id on subscribe by returning early", () => {
    appObjects.submitWarning = jest.fn();

    hostStateAdapter.subscribe("", appObjects, setVM);

    expect(appObjects.submitWarning).toHaveBeenCalledWith(
      "hostStateAdapter",
      "Missing ID for hostStateAdapter"
    );
  });

  it("should handle missing PM on subscribe", () => {
    // Create a new AppObjectRepo without the PM
    const emptyAppObjects = makeAppObjectRepo();
    emptyAppObjects.submitError = jest.fn();

    // Using an ID that doesn't have a PM
    hostStateAdapter.subscribe(testId, emptyAppObjects, setVM);

    expect(emptyAppObjects.submitError).toHaveBeenCalledWith(
      "hostStateAdapter",
      expect.stringContaining("Unable to find HostStatePM")
    );
  });

  it("should handle missing PM on unsubscribe without error", () => {
    // This should not throw an error
    expect(() => {
      hostStateAdapter.unsubscribe("non-existent", appObjects, setVM);
    }).not.toThrow();
  });
});
