/**
 * setApiStage.ts
 * 
 * This file defines a controller function for setting the API stage configuration.
 * The setApiStage controller provides a simple interface for changing the API environment
 * that the application communicates with.
 * 
 * Key concepts:
 * - Controller functions handle user input and direct operations
 * - Validates entity existence before performing operations
 * - Provides error handling and warning messages for missing components
 * - Updates the VivedAPIEntity singleton with new stage configuration
 * - Triggers change notifications to update dependent components
 * 
 * Usage pattern:
 * 1. Call setApiStage with desired stage and appObjects repository
 * 2. Controller validates entity existence and updates configuration
 * 3. Change notifications propagate to PMs and UI components
 * 4. Error handling provides feedback if entity is not available
 */

import { AppObjectRepo } from "@vived/core";
import { APIStage, VivedAPIEntity } from "../Entities";

/**
 * Sets the API stage configuration for the application
 * @param stage The APIStage to set as the current environment
 * @param appObjects The AppObjectRepo containing the VivedAPIEntity singleton
 */
export function setApiStage(stage: APIStage, appObjects: AppObjectRepo) {
  const sandbox = VivedAPIEntity.get(appObjects);
  if (sandbox) {
    sandbox.apiStage = stage;
  } else {
    appObjects.submitWarning("setApiStage", "Unable to find VivedAPIEntity");
  }
}
