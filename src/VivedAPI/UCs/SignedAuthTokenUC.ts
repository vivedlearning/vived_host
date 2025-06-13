/**
 * SignedAuthTokenUC.ts
 * 
 * This file defines the Use Case for retrieving signed authentication tokens.
 * SignedAuthTokenUC provides functionality for obtaining JWT or signed tokens
 * used to authenticate API requests with the VIVED backend services.
 * 
 * Key concepts:
 * - Abstract UC defining the interface for authentication token retrieval
 * - Handles token generation, validation, and renewal workflows
 * - Provides secure access to authentication credentials
 * - Implements singleton pattern for system-wide token management
 * - Returns promises for async token operations
 * 
 * Usage pattern:
 * 1. Get the singleton UC using SignedAuthTokenUC.get(appObjects)
 * 2. Call getAuthToken to retrieve current valid authentication token
 * 3. Handle the returned Promise with token string or errors
 * 4. Use token for authorizing subsequent API requests
 */

import { AppObjectRepo, AppObjectUC, getSingletonComponent } from "@vived/core";

/**
 * SignedAuthTokenUC provides functionality for retrieving authentication tokens.
 * Abstract class that defines the interface for authentication token operations.
 */
export abstract class SignedAuthTokenUC extends AppObjectUC {
  /** Unique type identifier for this component */
  static type = "SignedAuthTokenUC";

  /**
   * Retrieves a valid signed authentication token
   * @returns Promise resolving to the authentication token string
   */
  abstract getAuthToken(): Promise<string>;

  /**
   * Retrieves the singleton SignedAuthTokenUC from the app objects repository
   * @param appObjects The AppObjectRepo to get the singleton from
   * @returns The SignedAuthTokenUC singleton or undefined if not found
   */
  static get(appObjects: AppObjectRepo): SignedAuthTokenUC | undefined {
    return getSingletonComponent(SignedAuthTokenUC.type, appObjects);
  }
}
