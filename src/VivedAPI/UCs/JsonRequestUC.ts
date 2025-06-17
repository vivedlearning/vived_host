/**
 * JsonRequestUC.ts
 *
 * This file defines the core Use Case for making JSON HTTP requests to APIs.
 * JsonRequestUC provides a standardized interface for HTTP operations with JSON payloads,
 * supporting various HTTP methods and request configurations.
 *
 * Key concepts:
 * - Abstract UC defining the interface for JSON HTTP requests
 * - Supports GET, POST, PUT, PATCH, DELETE HTTP methods
 * - Handles request headers, parameters, and body data
 * - Returns Promise-based responses for async operations
 * - Implements singleton pattern for system-wide request handling
 *
 * Usage pattern:
 * 1. Get the singleton UC using JsonRequestUC.get(appObjects)
 * 2. Call doRequest with URL and request options
 * 3. Handle the returned Promise with response data or errors
 * 4. Use with VivedAPIEntity to construct endpoint URLs
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";

/**
 * Configuration options for JSON HTTP requests
 */
export interface RequestJSONOptions {
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
 * JsonRequestUC provides functionality for making JSON HTTP requests.
 * Abstract class that defines the interface for HTTP operations with JSON payloads.
 */
export abstract class JsonRequestUC extends AppObjectUC {
  /** Unique type identifier for this component */
  static type = "JsonRequestUC";

  /**
   * Performs a JSON HTTP request to the specified URL
   * @param url The target URL for the request
   * @param options Optional configuration for the request
   * @returns Promise resolving to the response data
   */
  abstract doRequest(url: URL, options?: RequestJSONOptions): Promise<any>;

  /**
   * Retrieves the singleton JsonRequestUC from the app objects repository
   * @param appObjects The AppObjectRepo to get the singleton from
   * @returns The JsonRequestUC singleton or undefined if not found
   */
  static get(appObjects: AppObjectRepo): JsonRequestUC | undefined {
    return getSingletonComponent(JsonRequestUC.type, appObjects);
  }
}
