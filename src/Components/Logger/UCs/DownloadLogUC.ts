import {
  getSingletonComponent,
  AppObject,
  AppObjectRepo,
  AppObjectUC
} from "@vived/core";
import { downloadFile } from "../../../Utilities/downloadFile";
import { LoggerEntity } from "../Entities";

export abstract class DownloadLogUC extends AppObjectUC {
  static type = "DownloadLogUC";

  abstract downloadFile(filename: string, file: Blob): void;
  abstract doDownload(): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<DownloadLogUC>(DownloadLogUC.type, appObjects);
  }
}

export function makeDownloadLogUC(appObject: AppObject): DownloadLogUC {
  return new DownloadLogUCImp(appObject);
}

class DownloadLogUCImp extends DownloadLogUC {
  private get logger() {
    return this.getCachedSingleton<LoggerEntity>(LoggerEntity.type);
  }

  downloadFile = downloadFile;

  doDownload(): void {
    if (!this.logger) return;

    const filename = "vivedPlayerLog.json";

    const logsArray = this.logger.logs;
    const logData = JSON.stringify(logsArray, null, 2);
    const file = new Blob([logData], { type: "application/pdf" });

    this.downloadFile(filename, file);
  }

  constructor(appObject: AppObject) {
    super(appObject, DownloadLogUC.type);

    this.appObjects.registerSingleton(this);
  }
}
