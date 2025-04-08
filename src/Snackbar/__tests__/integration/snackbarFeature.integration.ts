import { makeAppObjectRepo } from "@vived/core";
import { setupSnackbar } from "../../Factories/setupSnackbar";
import { snackbarAdapter } from "../../Adapters/snackbarAdapter";
import { makeSnackbar } from "../../Controllers/makeSnackbar";
import { dismissActiveSnackbar } from "../../Controllers/dismissActiveSnackbar";
import { callActiveSnackbarAction } from "../../Controllers/callActiveSnackbarAction";
import { SnackbarVM, defaultSnackbarVM } from "../../PMs/SnackbarPM";
import { SnackbarRepo } from "../../Entities/SnackbarRepo";

/**
 * Integration test for the Snackbar feature
 * 
 * This test verifies the interactions between:
 * - SnackbarRepo (entity)
 * - SnackbarPM (presentation manager)
 * - snackbarAdapter (adapter)
 * - Controllers: makeSnackbar, dismissActiveSnackbar, callActiveSnackbarAction
 */
describe("Snackbar Feature Integration", () => {
  it("should update subscribed views when makeSnackbar is called", async () => {
    // Setup repository and components
    const appObjects = makeAppObjectRepo();
    
    // 1. Setup the snackbar feature
    setupSnackbar(appObjects);
    
    // Manually get the repo to verify and control behavior
    const repo = SnackbarRepo.get(appObjects);
    expect(repo).toBeDefined();
    
    // Mock the monitorSnackbarTime method to prevent timing issues in tests
    // This focuses our test on the integration point rather than timing behavior
    jest.spyOn(repo as any, 'monitorSnackbarTime').mockImplementation(() => {});
    
    // Mock view function for the adapter
    const mockSetVM = jest.fn();
    
    // Subscribe to adapter
    snackbarAdapter.subscribe(appObjects, mockSetVM);
    
    // Verify the initial state matches the default snackbar VM (no active snackbar)
    expect(mockSetVM).toHaveBeenCalledWith(defaultSnackbarVM);
    
    // Reset the mock to check only future calls
    mockSetVM.mockClear();
    
    // 2. Call the makeSnackbar controller with a test message
    const testMessage = "Test Snackbar Message";
    const testDuration = 2; // 2 seconds
    makeSnackbar(appObjects, testMessage, undefined, testDuration);
    
    // 3. Verify the adapter called the view function with the expected view model
    expect(mockSetVM).toHaveBeenCalledWith({
      message: testMessage,
      durationInSeconds: testDuration,
      actionButtonText: undefined
    });
    
    // Test with an action
    // First clear the first snackbar
    repo?.dismissActiveSnackbar();
    mockSetVM.mockClear();
    
    const actionFn = jest.fn();
    const actionText = "Action";
    
    // Create a new snackbar with an action
    makeSnackbar(
      appObjects,
      "Message with action", 
      { actionButtonText: actionText, action: actionFn },
      3
    );
    
    // Verify view is updated with action button text
    expect(mockSetVM).toHaveBeenCalledWith({
      message: "Message with action",
      durationInSeconds: 3,
      actionButtonText: actionText
    });
    
    // Test cleanup by unsubscribing
    mockSetVM.mockClear();
    snackbarAdapter.unsubscribe(appObjects, mockSetVM);
    
    // Make a change that shouldn't reach the view function
    makeSnackbar(appObjects, "Message after unsubscribe");
    
    // Verify the view function wasn't called after unsubscribing
    expect(mockSetVM).not.toHaveBeenCalled();
  });

  it("should update views when dismissActiveSnackbar controller is called", () => {
    // Setup repository and components
    const appObjects = makeAppObjectRepo();
    setupSnackbar(appObjects);
    
    // Mock the monitorSnackbarTime method to prevent timing issues
    const repo = SnackbarRepo.get(appObjects);
    jest.spyOn(repo as any, 'monitorSnackbarTime').mockImplementation(() => {});
    
    // Mock view function for the adapter
    const mockSetVM = jest.fn();
    
    // Subscribe to adapter
    snackbarAdapter.subscribe(appObjects, mockSetVM);
    
    // Clear initial calls
    mockSetVM.mockClear();
    
    // Create a snackbar first
    makeSnackbar(appObjects, "Test Message");
    
    // Verify the snackbar was created and view was updated
    expect(mockSetVM).toHaveBeenCalledWith({
      message: "Test Message",
      durationInSeconds: 4, // default duration
      actionButtonText: undefined
    });
    
    // Reset the mock to check only future calls
    mockSetVM.mockClear();
    
    // Call the dismissActiveSnackbar controller
    dismissActiveSnackbar(appObjects);
    
    // Verify the view was updated to show no active snackbar
    expect(mockSetVM).toHaveBeenCalledWith(defaultSnackbarVM);
  });

  it("should execute action and update views when callActiveSnackbarAction controller is called", () => {
    // Setup repository and components
    const appObjects = makeAppObjectRepo();
    setupSnackbar(appObjects);
    
    // Mock the monitorSnackbarTime method to prevent timing issues
    const repo = SnackbarRepo.get(appObjects);
    jest.spyOn(repo as any, 'monitorSnackbarTime').mockImplementation(() => {});
    
    // Mock view function for the adapter
    const mockSetVM = jest.fn();
    
    // Subscribe to adapter
    snackbarAdapter.subscribe(appObjects, mockSetVM);
    
    // Clear initial calls
    mockSetVM.mockClear();
    
    // Create a mock action function
    const mockAction = jest.fn();
    
    // Create a snackbar with an action
    makeSnackbar(
      appObjects, 
      "Action Message", 
      { actionButtonText: "Click Me", action: mockAction },
      5
    );
    
    // Verify the snackbar was created with action button
    expect(mockSetVM).toHaveBeenCalledWith({
      message: "Action Message",
      durationInSeconds: 5,
      actionButtonText: "Click Me"
    });
    
    // Reset the mock to check only future calls
    mockSetVM.mockClear();
    
    // Call the callActiveSnackbarAction controller
    callActiveSnackbarAction(appObjects);
    
    // Verify the action was called
    expect(mockAction).toHaveBeenCalled();
    
    // Verify the view was updated to show no active snackbar (snackbar dismissed after action)
    expect(mockSetVM).toHaveBeenCalledWith(defaultSnackbarVM);
  });
});