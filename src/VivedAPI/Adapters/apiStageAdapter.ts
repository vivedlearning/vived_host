/**
 * apiStageAdapter.ts
 * 
 * This file defines an adapter for connecting API stage presentation logic to UI frameworks.
 * The apiStageAdapter provides a standardized interface for binding API stage configuration
 * to view components, handling subscriptions and view model updates.
 * 
 * Key concepts:
 * - Adapter implements SingletonPmAdapter interface for UI framework integration
 * - Manages subscription lifecycle for view components
 * - Provides default view model values for initialization
 * - Handles error cases when presentation manager is unavailable
 * - Enables reactive UI updates when API stage configuration changes
 * 
 * Usage pattern:
 * 1. UI frameworks use this adapter to bind to API stage state
 * 2. Adapter manages PM subscriptions and view function callbacks
 * 3. View components receive API stage updates automatically
 * 4. Proper cleanup handled through unsubscribe mechanism
 */

import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { APIStage } from "../Entities";
import { ApiStagePM } from "../PMs/ApiStagePM";

/**
 * Adapter for connecting API stage presentation logic to UI frameworks.
 * Implements SingletonPmAdapter to provide standardized view binding for API stage configuration.
 */
export const apiStageAdapter: SingletonPmAdapter<APIStage> = {
  /** Default view model value used when PM is not available */
  defaultVM: APIStage.PRODUCTION,
  
  /**
   * Subscribes a view function to receive API stage updates
   * @param appObjects The AppObjectRepo containing the ApiStagePM
   * @param setVM Callback function to update the view with new API stage values
   */
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: APIStage) => void) => {
    const pm = ApiStagePM.get(appObjects);
    if (!pm) {
      appObjects.submitError("apiStageAdapter", "Unable to find ApiStagePM");
      return;
    }
    pm.addView(setVM);
  },
  
  /**
   * Unsubscribes a view function from API stage updates
   * @param appObjects The AppObjectRepo containing the ApiStagePM
   * @param setVM Callback function to remove from view updates
   */
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: APIStage) => void) => {
    const pm = ApiStagePM.get(appObjects);
    if (!pm) {
      appObjects.submitError("apiStageAdapter", "Unable to find ApiStagePM");
      return;
    }
    pm.removeView(setVM);
  }
};
