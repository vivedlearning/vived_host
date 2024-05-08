
import { getSingletonComponent, HostAppObject, HostAppObjectRepo, HostAppObjectUC } from "../../../HostAppObject";
import { VivedAPIEntity } from "../Entities/VivedAPIEntity";
import { BasicFetchOptions, BasicFetchUC } from "./BasicFetchUC";
import { JsonRequestUC } from "./JsonRequestUC";

export abstract class FileUploadUC extends HostAppObjectUC {
  static type = "FileUploadUC";

  abstract doUpload(file: File): Promise<void>;

  static get(appObjects: HostAppObjectRepo): FileUploadUC | undefined {
    return getSingletonComponent(FileUploadUC.type, appObjects);
  }
}

export function makeFileUploadUC(appObject: HostAppObject): FileUploadUC {
  return new FileUploadUCImp(appObject);
}

class FileUploadUCImp extends FileUploadUC {
  private get vivedAPI(): VivedAPIEntity | undefined {
    return this.getCachedSingleton<VivedAPIEntity>(VivedAPIEntity.type);
  }

  private get requestJSON() {
    return this.getCachedSingleton<JsonRequestUC>(JsonRequestUC.type)?.doRequest
  }

  private get basicFetch() {
    return this.getCachedSingleton<BasicFetchUC>(BasicFetchUC.type)?.doRequest
  }

  doUpload = (file: File): Promise<void> => {
    const vivedAPI = this.vivedAPI;
    const requestJSON = this.requestJSON;
    const basicFetch = this.basicFetch;

    if(!vivedAPI || !requestJSON || !basicFetch)  {
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
  }

  constructor(appObject: HostAppObject) {
    super(appObject, FileUploadUC.type);
    this.appObjects.registerSingleton(this);
  }
}
