/**
 * BasicFetchUC.ts
 * 
 * This file defines the core Use Case for making basic HTTP fetch requests.
 * BasicFetchUC provides a standardized interface for HTTP operations that return
 * raw Response objects rather than parsed JSON data.
 * 
 * Key concepts:
 * - Abstract UC defining the interface for basic HTTP fetch operations
 * - Supports all standard HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * - Returns raw Response objects for flexible response handling
 * - Handles request headers, parameters, and body data
 * - Implements singleton pattern for system-wide request handling
 * 
 * Usage pattern:
 * 1. Get the singleton UC using BasicFetchUC.get(appObjects)
 * 2. Call doRequest with URL and request options
 * 3. Handle the returned Promise with raw Response object
 * 4. Process response data according to content type and needs
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";

/**
 * Configuration options for basic HTTP fetch requests
 */
export interface BasicFetchOptions {
  /** HTTP headers to include in the request */
  headers?: any;
  /** HTTP method for the request */
  method: "GET" | "PATCH" | "POST" | "PUT" | "DELETE" | undefined;
  /** URL parameters to include in the request */
  params?: any;
  /** Request body data for POST/PUT/PATCH requests */
  body?: any;
}

/**
 * BasicFetchUC provides functionality for making basic HTTP fetch requests.
 * Abstract class that defines the interface for HTTP operations returning raw Response objects.
 */
export abstract class BasicFetchUC extends AppObjectUC {
  /** Unique type identifier for this component */
  static type = "BasicFetchUC";

  /**
   * Performs a basic HTTP fetch request to the specified URL
   * @param url The target URL for the request
   * @param options Optional configuration for the request
   * @returns Promise resolving to the raw Response object
   */
  abstract doRequest(url: URL, options?: BasicFetchOptions): Promise<Response>;

  /**
   * Retrieves the singleton BasicFetchUC from the app objects repository
   * @param appObjects The AppObjectRepo to get the singleton from
   * @returns The BasicFetchUC singleton or undefined if not found
   */
  static get(appObjects: AppObjectRepo): BasicFetchUC | undefined {
    return getSingletonComponent(BasicFetchUC.type, appObjects);
  }
}
