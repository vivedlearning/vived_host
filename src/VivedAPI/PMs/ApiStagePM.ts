/**
 * ApiStagePM.ts
 *
 * This file defines the Presentation Manager for API stage configuration.
 * ApiStagePM bridges the VivedAPIEntity domain logic with UI components,
 * managing the display and interaction of API environment settings.
 *
 * Key concepts:
 * - PM extends AppObjectPM and manages view model state for API stage
 * - Observes VivedAPIEntity changes and updates UI accordingly
 * - Provides value comparison logic for efficient view updates
 * - Implements singleton pattern for system-wide stage management
 * - Handles API stage transitions and notifications
 *
 * Usage pattern:
 * 1. Get the singleton PM using ApiStagePM.get(appObjects)
 * 2. Connect to UI components that display/edit API stage
 * 3. PM automatically updates views when entity state changes
 * 4. Use with adapters to bind to specific UI frameworks
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectPM,
  AppObjectRepo
} from "@vived/core";
import { APIStage, VivedAPIEntity } from "../Entities";

/**
 * ApiStagePM provides presentation logic for API stage configuration.
 * Abstract class that manages the view model for API environment settings.
 */
export abstract class ApiStagePM extends AppObjectPM<APIStage> {
  /** Unique type identifier for this component */
  static type = "ApiStagePM";

  /**
   * Retrieves the singleton ApiStagePM from the app objects repository
   * @param appObjects The AppObjectRepo to get the singleton from
   * @returns The ApiStagePM singleton or undefined if not found
   */
  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ApiStagePM>(ApiStagePM.type, appObjects);
  }
}

/**
 * Factory function to create a new ApiStagePM instance
 * @param appObject The AppObject to attach the PM to
 * @returns A new ApiStagePM instance
 */
export function makeApiStagePM(appObject: AppObject): ApiStagePM {
  return new ApiStagePMImp(appObject);
}

/**
 * Concrete implementation of ApiStagePM
 * This private class handles the actual presentation logic for API stage management
 */
class ApiStagePMImp extends ApiStagePM {
  /**
   * Gets the VivedAPIEntity from the same app objects repository
   * Uses cached singleton access for efficient repeated access
   */
  private get api() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  /**
   * Compares two APIStage values for equality to determine if view updates are needed
   * @param a First APIStage value to compare
   * @param b Second APIStage value to compare
   * @returns True if the values are equal, false otherwise
   */
  vmsAreEqual(a: APIStage, b: APIStage): boolean {
    return a === b;
  }

  /**
   * Handles entity change notifications and updates the view
   * Called when the VivedAPIEntity's API stage changes
   */
  onEntityChange = () => {
    if (!this.api) return;

    this.doUpdateView(this.api.apiStage);
  };

  /**
   * Constructs a new ApiStagePMImp and sets up entity observation
   * @param appObject The AppObject this PM belongs to
   */
  constructor(appObject: AppObject) {
    super(appObject, ApiStagePM.type);
    this.appObjects.registerSingleton(this);

    this.api?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
