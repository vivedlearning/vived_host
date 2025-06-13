/**
 * BlobRequestUC.ts
 * 
 * This file defines the Use Case for making HTTP requests that return binary data as Blobs.
 * BlobRequestUC provides functionality for downloading files, images, and other binary
 * content from API endpoints, returning the data as Blob objects for further processing.
 * 
 * Key concepts:
 * - Abstract UC defining the interface for binary data HTTP requests
 * - Supports all standard HTTP methods for blob retrieval
 * - Returns Blob objects suitable for file downloads or binary processing
 * - Handles request headers, parameters, and body data
 * - Implements singleton pattern for system-wide blob request handling
 * 
 * Usage pattern:
 * 1. Get the singleton UC using BlobRequestUC.get(appObjects)
 * 2. Call doRequest with URL and request options
 * 3. Handle the returned Promise with Blob object
 * 4. Process blob data for downloads, display, or further operations
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";

/**
 * Configuration options for binary blob HTTP requests
 */
export interface RequestBlobOptions {
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
 * BlobRequestUC provides functionality for making HTTP requests that return binary data.
 * Abstract class that defines the interface for blob/binary data retrieval operations.
 */
export abstract class BlobRequestUC extends AppObjectUC {
  /** Unique type identifier for this component */
  static type = "BlobRequestUC";

  /**
   * Performs an HTTP request that returns binary data as a Blob
   * @param url The target URL for the request
   * @param options Optional configuration for the request
   * @returns Promise resolving to the response data as a Blob
   */
  abstract doRequest(url: URL, options?: RequestBlobOptions): Promise<Blob>;

  /**
   * Retrieves the singleton BlobRequestUC from the app objects repository
   * @param appObjects The AppObjectRepo to get the singleton from
   * @returns The BlobRequestUC singleton or undefined if not found
   */
  static get(appObjects: AppObjectRepo): BlobRequestUC | undefined {
    return getSingletonComponent(BlobRequestUC.type, appObjects);
  }
}
