// filepath: c:\Users\amosp\Documents\WebGL\vivedlearning_host\src\Assets\Mocks\AssetFilePMMock.ts
import { AppObject } from "@vived/core";
import { AssetFilePM } from "../PMs/AssetFilePM";

/**
 * Mock implementation of AssetFilePM for testing
 * Provides Jest mock functions for testing adapters and other components
 */
export class AssetFilePMMock extends AssetFilePM {
  /**
   * Mock implementation of vmsAreEqual for testing
   */
  vmsAreEqual = jest.fn();

  /**
   * Creates a new AssetFilePMMock instance
   *
   * @param appObject - The app object to associate with this mock PM
   */
  constructor(appObject: AppObject) {
    super(appObject, AssetFilePM.type);
  }
}
