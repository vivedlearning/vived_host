/**
 * VivedAPIEntity.ts
 * 
 * This file defines the core entity for managing VIVED API configuration and authentication.
 * The VivedAPIEntity acts as a singleton component that centralizes API communication settings,
 * including environment-specific base URLs and user authentication tokens.
 * 
 * Key concepts:
 * - Manages API stage configuration (Production, Staging, Development, Local)
 * - Stores and tracks user authentication tokens
 * - Provides environment-specific base URLs for API requests
 * - Notifies observers when API settings change
 * - Implements singleton pattern for system-wide API configuration
 * 
 * Usage pattern:
 * 1. Get the singleton entity using VivedAPIEntity.get(appObjects)
 * 2. Configure API stage and user token as needed
 * 3. Use baseUrl and getEndpointURL for API requests
 * 4. Register change observers to react to configuration updates
 */

import { MemoizedString } from "@vived/core";
import {
  getSingletonComponent,
  AppObject,
  AppObjectEntity,
  AppObjectRepo
} from "@vived/core";

/**
 * Enum representing different API environment stages
 */
export enum APIStage {
  /** Production environment with live data */
  PRODUCTION = "Production",
  /** Staging environment for pre-production testing */
  STAGING = "Staging",
  /** Development environment for testing */
  DEVELOPMENT = "Development",
  /** Local development environment */
  LOCAL = "LOCAL"
}

/**
 * VivedAPIEntity manages API configuration and authentication state.
 * This singleton entity provides centralized access to API settings including
 * environment-specific URLs and user authentication tokens.
 */
export class VivedAPIEntity extends AppObjectEntity {
  /** Unique type identifier for this component */
  static type = "VivedAPIEntity";

  /**
   * Retrieves the singleton VivedAPIEntity from the app objects repository
   * @param appObjects The AppObjectRepo to get the singleton from
   * @returns The VivedAPIEntity singleton or undefined if not found
   */
  static get(appObjects: AppObjectRepo): VivedAPIEntity | undefined {
    return getSingletonComponent(VivedAPIEntity.type, appObjects);
  }

  /** Production API base URL */
  productionURL = "https://api.vivedlearning.com";
  /** Staging API base URL */
  stagingURL = "https://api-staging.vivedlearning.com";
  /** Development API base URL */
  developmentURL = "https://api-test.vivedlearning.com";
  /** Local development API base URL */
  localURL = "http://localhost:3001";

  /** Memoized API stage that notifies on changes */
  private memoizedApiState = new MemoizedString(
    APIStage.PRODUCTION,
    this.notifyOnChange
  );

  /**
   * Gets the current API stage
   * @returns The current APIStage
   */
  get apiStage() {
    return this.memoizedApiState.val as APIStage;
  }
  
  /**
   * Sets the API stage and notifies observers of the change
   * @param apiState The new APIStage to set
   */
  set apiStage(apiState: APIStage) {
    this.memoizedApiState.val = apiState;
  }

  /**
   * Gets the base URL for the current API stage
   * @returns The base URL string for the current environment
   */
  get baseUrl(): string {
    if (this.memoizedApiState.val === APIStage.PRODUCTION) {
      return "https://api.vivedlearning.com";
    }
    if (this.memoizedApiState.val === APIStage.STAGING) {
      return "https://api-staging.vivedlearning.com";
    }
    if (this.memoizedApiState.val === APIStage.DEVELOPMENT) {
      return "https://api-test.vivedlearning.com";
    }
    return "http://localhost:3001";
  }

  /**
   * Constructs a complete endpoint URL using the current base URL
   * @param endpoint The endpoint path to append to the base URL
   * @returns A URL object representing the complete endpoint URL
   */
  getEndpointURL = (endpoint: string): URL => {
    return new URL(endpoint, this.baseUrl);
  };

  /** Memoized user authentication token that notifies on changes */
  private memoizedUserToken = new MemoizedString("", this.notifyOnChange);
  
  /**
   * Gets the current user authentication token
   * @returns The current user token string
   */
  get userToken(): string {
    return this.memoizedUserToken.val;
  }
  
  /**
   * Sets the user authentication token and notifies observers
   * @param val The new user token to set
   */
  set userToken(val: string) {
    this.memoizedUserToken.val = val;
  }

  /**
   * Constructs a new VivedAPIEntity and registers it as a singleton
   * @param appObject The AppObject this entity belongs to
   */
  constructor(appObject: AppObject) {
    super(appObject, VivedAPIEntity.type);
    this.appObjects.registerSingleton(this);
  }
}
