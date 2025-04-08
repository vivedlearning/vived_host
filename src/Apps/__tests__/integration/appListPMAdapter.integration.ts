import { makeAppObjectRepo } from "@vived/core";
import { appListPMAdapter } from "../../Adapters/appListPMAdapter";
import { makeAppEntity } from "../../Entities/AppEntity";
import { makeAppRepo } from "../../Entities/AppRepo";
import { makeAppsListPM } from "../../PMs/AppsListPM";

/**
 * Integration test for appListPMAdapter
 * 
 * This test verifies the interactions between:
 * - AppEntity
 * - AppRepoEntity
 * - AppsListPM
 * - appListPMAdapter
 */
describe("appListPMAdapter Integration", () => {
  it("should update the view when a new app is added to the repository", async () => {
    // Setup repository and components
    const appObjects = makeAppObjectRepo();
    
    // Important: Initialize AppRepo FIRST before AppsListPM
    // since AppsListPM depends on AppRepo
    const appRepoObject = appObjects.getOrCreate("appRepo");
    const appRepo = makeAppRepo(appRepoObject);
    
    // Initialize AppsListPM (after AppRepo)
    const appsPMObject = appObjects.getOrCreate("appsList");
    const appsListPM = makeAppsListPM(appsPMObject);
    
    // Mock view function for the adapter
    const mockSetVM = jest.fn();
    
    // Subscribe to adapter
    appListPMAdapter.subscribe(appObjects, mockSetVM);
    
    // Wait for initial rendering to occur
    await new Promise(process.nextTick);
    
    // Verify the initial state is empty (no apps)
    expect(mockSetVM).toHaveBeenCalledWith([]);
    
    // Reset the mock to check only future calls
    mockSetVM.mockClear();
    
    // Create an app
    const app1 = appRepo.createApp("app1");
    
    // Set it as assigned to owner (which should make it appear in the list)
    app1.assignedToOwner = true;
    
    // Wait for changes to propagate
    await new Promise(process.nextTick);
    
    // Verify the adapter called the view function with the app
    expect(mockSetVM).toHaveBeenCalledWith(["app1"]);
    
    // Reset the mock again
    mockSetVM.mockClear();
    
    // Create a second app
    const app2 = appRepo.createApp("app2");
    app2.assignedToOwner = true;
    
    // Wait for changes to propagate
    await new Promise(process.nextTick);
    
    // Verify the adapter called the view function with both apps
    // The order of apps in the array should match the order they were added to the repo
    expect(mockSetVM).toHaveBeenCalledWith(["app1", "app2"]);
    
    // Test removing an app from the list
    mockSetVM.mockClear();
    app1.assignedToOwner = false;
    
    // Wait for changes to propagate
    await new Promise(process.nextTick);
    
    // Verify the adapter updates to show only app2
    expect(mockSetVM).toHaveBeenCalledWith(["app2"]);
    
    // Test cleanup by unsubscribing
    mockSetVM.mockClear();
    appListPMAdapter.unsubscribe(appObjects, mockSetVM);
    
    // Make a change that shouldn't reach the view function
    const app3 = appRepo.createApp("app3");
    app3.assignedToOwner = true;
    
    // Wait for any potential changes to propagate
    await new Promise(process.nextTick);
    
    // Verify the view function wasn't called after unsubscribing
    expect(mockSetVM).not.toHaveBeenCalled();
  });
});