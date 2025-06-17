/**
 * PostNewAssetUC.ts
 *
 * This file defines the Use Case for creating new assets via the VIVED API.
 * PostNewAssetUC handles the complete workflow of uploading asset files and
 * creating asset metadata records through API requests.
 *
 * Key concepts:
 * - Orchestrates file upload and metadata creation for new assets
 * - Handles multipart file uploads with asset information
 * - Manages authentication tokens and API endpoints
 * - Coordinates between multiple UCs (JsonRequest, FileUpload, SignedAuthToken)
 * - Returns asset creation response with generated IDs
 *
 * Usage pattern:
 * 1. Get a UC instance using PostNewAssetUC.get(appObjects) or makePostNewAssetUC
 * 2. Call doPost with asset data including file and metadata
 * 3. Handle the returned Promise with asset creation response
 * 4. UC will coordinate authentication, file upload, and API requests
 */

import {
  AppObject,
  AppObjectRepo,
  AppObjectUC,
  generateUniqueID,
  getSingletonComponent
} from "@vived/core";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { FileUploadUC } from "./FileUploadUC";
import { JsonRequestUC, RequestJSONOptions } from "./JsonRequestUC";
import { SignedAuthTokenUC } from "./SignedAuthTokenUC";

/**
 * Data transfer object for new asset creation requests
 */
export interface NewAssetApiDto {
  /** Display name for the new asset */
  name: string;
  /** Description text for the asset */
  description: string;
  /** ID of the user who will own this asset */
  ownerID: string;
  /** File object containing the asset data */
  file: File;
}

/**
 * Response data transfer object for successful asset creation
 */
export interface NewAssetResponseDTO {
  /** Unique identifier assigned to the new asset */
  id: string;
  /** Final filename used for the stored asset file */
  filename: string;
}

/**
 * PostNewAssetUC provides functionality for creating new assets via API.
 * Abstract class that defines the interface for asset creation operations.
 */
export abstract class PostNewAssetUC extends AppObjectUC {
  /** Unique type identifier for this component */
  static type = "PostNewAssetUC";

  /**
   * Creates a new asset by uploading file and metadata to the API
   * @param data The asset creation data including file and metadata
   * @returns Promise resolving to the new asset response with ID and filename
   */
  abstract doPost(data: NewAssetApiDto): Promise<NewAssetResponseDTO>;

  /**
   * Retrieves a PostNewAssetUC component from an AppObject
   * @param appObjects The AppObjectRepo to get the component from
   * @returns The PostNewAssetUC component or undefined if not found
   */
  static get(appObjects: AppObjectRepo): PostNewAssetUC | undefined {
    return getSingletonComponent(PostNewAssetUC.type, appObjects);
  }
}

/**
 * Factory function to create a new PostNewAssetUC instance
 * @param appObject The AppObject to attach the UC to
 * @returns A new PostNewAssetUC instance
 */
export function makePostNewAssetUC(appObject: AppObject): PostNewAssetUC {
  return new PostNewAssetUCImp(appObject);
}

/**
 * Concrete implementation of PostNewAssetUC
 * This private class handles the actual asset creation workflow
 */
class PostNewAssetUCImp extends PostNewAssetUC {
  private get jsonRequester() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)
      ?.doRequest;
  }

  private get getPlayerAuthToken() {
    return this.getCachedSingleton<SignedAuthTokenUC>(SignedAuthTokenUC.type)
      ?.getAuthToken;
  }

  private get fileUploader() {
    return this.getCachedSingleton<FileUploadUC>(FileUploadUC.type)?.doUpload;
  }

  private get vivedAPI() {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  doPost = (data: NewAssetApiDto): Promise<NewAssetResponseDTO> => {
    const fileUploader = this.fileUploader;
    const getPlayerAuthToken = this.getPlayerAuthToken;
    const vivedAPI = this.vivedAPI;
    const jsonRequester = this.jsonRequester;

    if (!fileUploader || !getPlayerAuthToken || !vivedAPI || !jsonRequester) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      const { description, file, name, ownerID } = data;
      let assetId: string;

      const nameSplits = file.name.split(".");
      const extension = nameSplits[nameSplits.length - 1];
      const filename = `${generateUniqueID()}.${extension}`;
      const assetFile = new File([file], filename, {
        lastModified: Date.now()
      });

      fileUploader(assetFile)
        .then((_) => {
          return getPlayerAuthToken();
        })
        .then((token) => {
          const postURL = vivedAPI.getEndpointURL("assets");

          const body = {
            ownerId: ownerID,
            name,
            description,
            filename
          };

          const options: RequestJSONOptions = {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              Authorization: "Bearer " + token
            }
          };

          return jsonRequester(postURL, options);
        })
        .then((result) => {
          assetId = result.assetId;
          resolve({
            id: assetId,
            filename
          });
        })
        .catch((e) => {
          reject(e);
          return;
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, PostNewAssetUC.type);
    this.appObjects.registerSingleton(this);
  }
}
