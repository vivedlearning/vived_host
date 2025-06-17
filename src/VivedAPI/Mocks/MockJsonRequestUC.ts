/**
 * MockJsonRequestUC.ts
 *
 * This file provides a mock implementation of JsonRequestUC for testing and development.
 * MockJsonRequestUC replaces real HTTP request functionality with Jest mock functions,
 * enabling controlled testing scenarios and development without live API dependencies.
 *
 * Key concepts:
 * - Mock extends the real JsonRequestUC class to maintain interface compatibility
 * - Uses Jest mock functions to provide controllable request behavior
 * - Enables testing of components that depend on JSON HTTP requests
 * - Allows simulation of various response scenarios (success, failure, delays)
 * - Supports isolated unit testing without external API dependencies
 *
 * Usage pattern:
 * 1. Use makeMockJsonRequestUC to create and register the mock
 * 2. Configure mock behavior using Jest mock function methods
 * 3. Test components can verify request calls and control responses
 * 4. Replace with real implementation for integration testing
 */

import { AppObject, AppObjectRepo } from "@vived/core";
import { JsonRequestUC } from "../UCs/JsonRequestUC";

/**
 * Mock implementation of JsonRequestUC for testing and development
 * Provides Jest mock functions instead of real HTTP request functionality
 */
export class MockJsonRequestUC extends JsonRequestUC {
  /** Jest mock function for the doRequest method */
  doRequest = jest.fn();

  /**
   * Constructs a new MockJsonRequestUC
   * @param appObject The AppObject this mock UC belongs to
   */
  constructor(appObject: AppObject) {
    super(appObject, JsonRequestUC.type);
  }
}

/**
 * Factory function to create and register a MockJsonRequestUC
 * @param appObjects The AppObjectRepo to create the mock in
 * @returns A new MockJsonRequestUC instance
 */
export function makeMockJsonRequestUC(appObjects: AppObjectRepo) {
  return new MockJsonRequestUC(appObjects.getOrCreate("MockJsonRequestUC"));
}
