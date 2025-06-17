/**
 * FileUploadUC.ts
 *
 * This file defines the Use Case for uploading files to the VIVED API.
 * FileUploadUC handles the process of uploading file data to storage endpoints,
 * managing multipart form data and upload progress.
 *
 * Key concepts:
 * - Abstract UC defining the interface for file upload operations
 * - Handles file upload workflows with progress tracking
 * - Coordinates with BasicFetchUC for HTTP transport
 * - Manages multipart form data encoding and transmission
 * - Provides error handling for upload failures
 *
 * Usage pattern:
 * 1. Get a UC instance using FileUploadUC.get(appObjects) or makeFileUploadUC
 * 2. Call doUpload with File object to upload
 * 3. Handle the returned Promise for upload completion
 * 4. UC manages the HTTP upload mechanics and error handling
 */

import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { BasicFetchOptions, BasicFetchUC } from "./BasicFetchUC";
import { JsonRequestUC } from "./JsonRequestUC";

/**
 * FileUploadUC provides functionality for uploading files to APIs.
 * Abstract class that defines the interface for file upload operations.
 */
export abstract class FileUploadUC extends AppObjectUC {
  /** Unique type identifier for this component */
  static type = "FileUploadUC";

  /**
   * Uploads a file to the configured API endpoint
   * @param file The File object to upload
   * @returns Promise that resolves when upload is complete
   */
  abstract doUpload(file: File): Promise<void>;

  /**
   * Retrieves a FileUploadUC component from an AppObject
   * @param appObjects The AppObjectRepo to get the component from
   * @returns The FileUploadUC component or undefined if not found
   */
  static get(appObjects: AppObjectRepo): FileUploadUC | undefined {
    return getSingletonComponent(FileUploadUC.type, appObjects);
  }
}

/**
 * Factory function to create a new FileUploadUC instance
 * @param appObject The AppObject to attach the UC to
 * @returns A new FileUploadUC instance
 */
export function makeFileUploadUC(appObject: AppObject): FileUploadUC {
  return new FileUploadUCImp(appObject);
}

/**
 * Concrete implementation of FileUploadUC
 * This private class handles the actual file upload mechanics
 */
class FileUploadUCImp extends FileUploadUC {
  private get vivedAPI(): VivedAPIEntity | undefined {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  private get requestJSON() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)
      ?.doRequest;
  }

  private get basicFetch() {
    return this.getCachedSingleton<BasicFetchUC>(BasicFetchUC.type)?.doRequest;
  }

  doUpload = (file: File): Promise<void> => {
    const vivedAPI = this.vivedAPI;
    const requestJSON = this.requestJSON;
    const basicFetch = this.basicFetch;

    if (!vivedAPI || !requestJSON || !basicFetch) {
      return Promise.reject();
    }
    return new Promise<void>((resolve, reject) => {
      const getUploadURL = vivedAPI.getEndpointURL(
        `upload/large/DataVariants/${file.name}`
      );

      requestJSON(getUploadURL)
        .then((uploadURL) => {
          const url = new URL(uploadURL as string);
          const options: BasicFetchOptions = {
            method: "PUT",
            body: file
          };

          return basicFetch(url, options);
        })
        .then((_) => {
          resolve();
        })
        .catch((e: Error) => {
          this.warn(e.message);
          reject(e);
        });
    });
  };

  constructor(appObject: AppObject) {
    super(appObject, FileUploadUC.type);
    this.appObjects.registerSingleton(this);
  }
}
