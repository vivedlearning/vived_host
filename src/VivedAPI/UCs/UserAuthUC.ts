/**
 * UserAuthUC.ts
 *
 * This file defines the Use Case for user authentication operations.
 * UserAuthUC provides functionality for managing user login, logout, and
 * authentication refresh workflows with the VIVED API services.
 *
 * Key concepts:
 * - Abstract UC defining the interface for user authentication operations
 * - Handles login with username/password credentials
 * - Manages logout and session termination
 * - Provides authentication refresh for token renewal
 * - Implements singleton pattern for system-wide authentication management
 * - Coordinates with VivedAPIEntity for token storage
 *
 * Usage pattern:
 * 1. Get the singleton UC using UserAuthUC.get(appObjects)
 * 2. Call login with user credentials for authentication
 * 3. Use logout to terminate user sessions
 * 4. Call refreshAuthenticatedUser to renew authentication tokens
 */

import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

/**
 * UserAuthUC provides functionality for user authentication operations.
 * Abstract class that defines the interface for login, logout, and token refresh operations.
 */
export abstract class UserAuthUC extends AppObjectUC {
  /** Unique type identifier for this component */
  static type = "UserAuthUC";

  /**
   * Authenticates a user with username and password credentials
   * @param username The user's login username
   * @param password The user's login password
   * @returns Promise that resolves when login is complete
   */
  abstract login(username: string, password: string): Promise<void>;

  /**
   * Logs out the current user and terminates the session
   * @returns Promise that resolves when logout is complete
   */
  abstract logout(): Promise<void>;

  /**
   * Refreshes the current user's authentication token
   * @returns Promise that resolves when token refresh is complete
   */
  abstract refreshAuthenticatedUser(): Promise<void>;

  /**
   * Retrieves the singleton UserAuthUC from the app objects repository
   * @param appObjects The AppObjectRepo to get the singleton from
   * @returns The UserAuthUC singleton or undefined if not found
   */
  static get(appObjects: AppObjectRepo): UserAuthUC | undefined {
    return getSingletonComponent(UserAuthUC.type, appObjects);
  }
}
