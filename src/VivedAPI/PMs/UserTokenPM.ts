/**
 * UserTokenPM.ts
 * 
 * This file defines the Presentation Manager for user authentication token display.
 * UserTokenPM bridges the VivedAPIEntity token state with UI components,
 * managing the display and interaction of user authentication tokens.
 * 
 * Key concepts:
 * - PM extends AppObjectPM and manages view model state for user tokens
 * - Observes VivedAPIEntity token changes and updates UI accordingly
 * - Provides value comparison logic for efficient view updates
 * - Implements singleton pattern for system-wide token display management
 * - Handles token state transitions and notifications
 * 
 * Usage pattern:
 * 1. Get the singleton PM using UserTokenPM.get(appObjects)
 * 2. Connect to UI components that display user authentication tokens
 * 3. PM automatically updates views when entity token state changes
 * 4. Use with adapters to bind to specific UI frameworks
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { VivedAPIEntity } from "../Entities";

/**
 * UserTokenPM provides presentation logic for user authentication token display.
 * Abstract class that manages the view model for user token information.
 */
export abstract class UserTokenPM extends AppObjectPM<string> {
  /** Unique type identifier for this component */
  static type = "UserTokenPM";

  /**
   * Retrieves the singleton UserTokenPM from the app objects repository
   * @param appObjects The AppObjectRepo to get the singleton from
   * @returns The UserTokenPM singleton or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<UserTokenPM>(UserTokenPM.type, appObjects);
  }
}

/**
 * Factory function to create a new UserTokenPM instance
 * @param appObject The AppObject to attach the PM to
 * @returns A new UserTokenPM instance
 */
export function makeUserTokenPM(appObject: AppObject): UserTokenPM {
  return new UserTokenPMImp(appObject);
}

/**
 * Concrete implementation of UserTokenPM
 * This private class handles the actual presentation logic for user token management
 */
class UserTokenPMImp extends UserTokenPM {
  /**
   * Gets the VivedAPIEntity from the same app objects repository
   * Uses cached singleton access for efficient repeated access
   */
  private get sandbox() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  /**
   * Compares two token string values for equality to determine if view updates are needed
   * @param a First token string to compare
   * @param b Second token string to compare
   * @returns True if the token values are equal, false otherwise
   */
  vmsAreEqual(a: string, b: string): boolean {
    return a === b;
  }

  /**
   * Handles entity change notifications and updates the view
   * Called when the VivedAPIEntity's user token changes
   */
  onEntityChange = () => {
    if (!this.sandbox) return;

    this.doUpdateView(this.sandbox.userToken);
  };

  constructor(appObject: AppObject) {
    super(appObject, UserTokenPM.type);
    this.appObjects.registerSingleton(this);

    this.sandbox?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
