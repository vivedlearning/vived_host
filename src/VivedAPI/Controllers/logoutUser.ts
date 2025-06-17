/**
 * logoutUser.ts
 *
 * This file defines a controller function for user logout operations.
 * The logoutUser controller provides a simple interface for terminating user
 * sessions and clearing authentication state through the VIVED API.
 *
 * Key concepts:
 * - Controller functions handle user input and direct logout operations
 * - Validates UserAuthUC existence before performing logout operations
 * - Provides error handling and warning messages for missing components
 * - Returns promises for async logout workflows
 * - Coordinates with UserAuthUC for actual logout logic
 *
 * Usage pattern:
 * 1. Call logoutUser with appObjects repository
 * 2. Controller validates UC existence and initiates logout workflow
 * 3. Handle returned Promise for logout success or failure
 * 4. Error handling provides feedback if authentication UC is unavailable
 */

import { AppObjectRepo } from "@vived/core";
import { UserAuthUC } from "../UCs";

/**
 * Logs out the current user and terminates the session
 * @param appObjects The AppObjectRepo containing the UserAuthUC
 * @returns Promise that resolves when logout is complete or rejects on error
 */
export function logoutUser(appObjects: AppObjectRepo): Promise<void> {
  const uc = UserAuthUC.get(appObjects);

  if (uc) {
    return uc.logout();
  } else {
    appObjects.submitWarning("logoutUser", "Unable to find UserAuthUC");
    return Promise.reject(new Error("Unable to find UserAuthUC"));
  }
}
