import {
  AppObject,
  AppObjectEntityRepo,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";
import { AppEntity, makeAppEntity } from "./AppEntity";

export enum AppReleaseStage {
  RELEASE = "RELEASE",
  BETA = "BETA",
  ALPHA = "ALPHA"
}

export abstract class AppRepoEntity extends AppObjectEntityRepo<AppEntity> {
  static type = "AppRepoEntity";

  static get(appObjects: AppObjectRepo) {
    return appObjects.getSingleton<AppRepoEntity>(AppRepoEntity.type);
  }

  abstract getOrCreate: (id: string) => AppEntity;
  abstract getApp: (id: string) => AppEntity | undefined;
  abstract getAllApps: () => AppEntity[];
  abstract deleteApp: (id: string) => void;
  abstract hasApp: (id: string) => boolean;
  abstract appFactory: (id: string) => AppEntity;

  abstract appReleaseStage: AppReleaseStage;

  abstract deleteAllApps: () => void;
}

export function makeAppRepo(appObject: AppObject): AppRepoEntity {
  return new AppRepoImp(appObject);
}

class AppRepoImp extends AppRepoEntity {
  appReleaseStage: AppReleaseStage = AppReleaseStage.RELEASE;

  appFactory = (id: string): AppEntity => {
    return makeAppEntity(this.appObjects.getOrCreate(id));
  };

  getOrCreate = (id: string): AppEntity => {
    const existingApp = this.getForAppObject(id);
    if (existingApp) {
      return existingApp;
    }

    const app = this.appFactory(id);
    this.add(app);
    return app;
  };

  getApp = (id: string): AppEntity | undefined => {
    return this.getForAppObject(id);
  };

  getAllApps = (): AppEntity[] => {
    return this.getAll();
  };

  deleteApp = (id: string): void => {
    this.removeForAppObject(id);
  };

  deleteAllApps = (): void => {
    const apps = this.getAllApps();
    apps.forEach((app) => {
      this.deleteApp(app.id);
    });
  };

  hasApp = (id: string): boolean => {
    return this.hasForAppObject(id);
  };

  constructor(appObject: AppObject) {
    super(appObject, AppRepoEntity.type);

    this.appObjects.registerSingleton(this);
  }
}
