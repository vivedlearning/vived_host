/**
 * DeleteAssetOnAPIUC.ts
 *
 * This file defines the Use Case for deleting assets via the VIVED API.
 * DeleteAssetOnAPIUC handles the workflow of removing asset records from
 * the backend storage system through authenticated API requests.
 *
 * Key concepts:
 * - Orchestrates asset deletion through API endpoints
 * - Manages authentication tokens for authorized deletion requests
 * - Coordinates between JsonRequestUC and SignedAuthTokenUC
 * - Handles error cases and provides feedback for deletion operations
 * - Ensures proper cleanup of asset data and metadata
 *
 * Usage pattern:
 * 1. Get a UC instance using DeleteAssetOnAPIUC.get(appObjects) or makeDeleteAssetOnAPIUC
 * 2. Call doDelete with the asset ID to remove
 * 3. Handle the returned Promise for deletion completion
 * 4. UC manages authentication and API communication details
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";
import { SignedAuthTokenUC } from "./SignedAuthTokenUC";

/**
 * DeleteAssetOnAPIUC provides functionality for deleting assets via API.
 * Abstract class that defines the interface for asset deletion operations.
 */
export abstract class DeleteAssetOnAPIUC extends AppObjectUC {
  /** Unique type identifier for this component */
  static type = "DeleteAssetOnAPIUC";

  /**
   * Deletes an asset from the API by its ID
   * @param assetID The unique identifier of the asset to delete
   * @returns Promise that resolves when deletion is complete
   */
  abstract doDelete(assetID: string): Promise<void>;

  /**
   * Retrieves a DeleteAssetOnAPIUC component from an AppObject
   * @param appObjects The AppObjectRepo to get the component from
   * @returns The DeleteAssetOnAPIUC component or undefined if not found
   */
  static get(appObjects: AppObjectRepo): DeleteAssetOnAPIUC | undefined {
    return getSingletonComponent(DeleteAssetOnAPIUC.type, appObjects);
  }
}

/**
 * Factory function to create a new DeleteAssetOnAPIUC instance
 * @param appObject The AppObject to attach the UC to
 * @returns A new DeleteAssetOnAPIUC instance
 */
export function makeDeleteAssetOnAPIUC(
  appObject: AppObject
): DeleteAssetOnAPIUC {
  return new DeleteAssetUCImp(appObject);
}

/**
 * Concrete implementation of DeleteAssetOnAPIUC
 * This private class handles the actual asset deletion workflow
 */
class DeleteAssetUCImp extends DeleteAssetOnAPIUC {
  private get jsonRequester() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)
      ?.doRequest;
  }

  private get getAuthToken() {
    return this.getCachedSingleton<SignedAuthTokenUC>(SignedAuthTokenUC.type)
      ?.getAuthToken;
  }

  private get vivedAPI() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  doDelete = (assetID: string): Promise<void> => {
    const getAuthToken = this.getAuthToken;
    const vivedAPI = this.vivedAPI;
    const jsonRequester = this.jsonRequester;

    if (!getAuthToken || !vivedAPI || !jsonRequester) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      getAuthToken()
        .then((token) => {
          const postURL = vivedAPI.getEndpointURL(`assets/${assetID}`);

          const options: RequestJSONOptions = {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + token
            }
          };

          return jsonRequester(postURL, options);
        })
        .then((_) => {
          resolve();
        })
        .catch((e) => {
          reject(e);
          return;
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, DeleteAssetOnAPIUC.type);
    this.appObjects.registerSingleton(this);
  }
}
