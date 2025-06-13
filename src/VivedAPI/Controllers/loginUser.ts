/**
 * loginUser.ts
 * 
 * This file defines a controller function for user authentication login operations.
 * The loginUser controller provides a simple interface for authenticating users
 * with username and password credentials through the VIVED API.
 * 
 * Key concepts:
 * - Controller functions handle user input and direct authentication operations
 * - Validates UserAuthUC existence before performing login operations
 * - Provides error handling and warning messages for missing components
 * - Returns promises for async authentication workflows
 * - Coordinates with UserAuthUC for actual authentication logic
 * 
 * Usage pattern:
 * 1. Call loginUser with credentials and appObjects repository
 * 2. Controller validates UC existence and initiates login workflow
 * 3. Handle returned Promise for authentication success or failure
 * 4. Error handling provides feedback if authentication UC is unavailable
 */

import { AppObjectRepo } from "@vived/core";
import { UserAuthUC } from "../UCs";

/**
 * Authenticates a user with username and password credentials
 * @param userName The user's login username
 * @param password The user's login password
 * @param appObjects The AppObjectRepo containing the UserAuthUC
 * @returns Promise that resolves when login is complete or rejects on error
 */
export function loginUser(
  userName: string,
  password: string,
  appObjects: AppObjectRepo
): Promise<void> {
  const uc = UserAuthUC.get(appObjects);

  if (uc) {
    return uc.login(userName, password);
  } else {
    appObjects.submitWarning("loginUser", "Unable to find UserAuthUC");
    return Promise.reject(new Error("Unable to find UserAuthUC"));
  }
}
