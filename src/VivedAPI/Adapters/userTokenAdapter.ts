/**
 * userTokenAdapter.ts
 *
 * This file defines an adapter for connecting user token presentation logic to UI frameworks.
 * The userTokenAdapter provides a standardized interface for binding user authentication
 * token state to view components, handling subscriptions and view model updates.
 *
 * Key concepts:
 * - Adapter implements SingletonPmAdapter interface for UI framework integration
 * - Manages subscription lifecycle for view components displaying user tokens
 * - Provides default view model values for initialization (empty string)
 * - Handles error cases when presentation manager is unavailable
 * - Enables reactive UI updates when user authentication token changes
 *
 * Usage pattern:
 * 1. UI frameworks use this adapter to bind to user token state
 * 2. Adapter manages PM subscriptions and view function callbacks
 * 3. View components receive token updates automatically
 * 4. Proper cleanup handled through unsubscribe mechanism
 */

import { AppObjectRepo, SingletonPmAdapter } from "@vived/core";
import { UserTokenPM } from "../PMs/UserTokenPM";

/**
 * Adapter for connecting user token presentation logic to UI frameworks.
 * Implements SingletonPmAdapter to provide standardized view binding for user authentication tokens.
 */
export const userTokenAdapter: SingletonPmAdapter<string> = {
  /** Default view model value used when PM is not available */
  defaultVM: "",

  /**
   * Subscribes a view function to receive user token updates
   * @param appObjects The AppObjectRepo containing the UserTokenPM
   * @param setVM Callback function to update the view with new token values
   */
  subscribe: (appObjects: AppObjectRepo, setVM: (vm: string) => void) => {
    const pm = UserTokenPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("userTokenAdapter", "Unable to find UserTokenPM");
      return;
    }
    pm.addView(setVM);
  },

  /**
   * Unsubscribes a view function from user token updates
   * @param appObjects The AppObjectRepo containing the UserTokenPM
   * @param setVM Callback function to remove from view updates
   */
  unsubscribe: (appObjects: AppObjectRepo, setVM: (vm: string) => void) => {
    const pm = UserTokenPM.get(appObjects);
    if (!pm) {
      appObjects.submitError("userTokenAdapter", "Unable to find UserTokenPM");
      return;
    }
    pm.removeView(setVM);
  }
};
