
import { getSingletonComponent, HostAppObject, HostAppObjectEntityRepo, HostAppObjectRepo } from "../../../HostAppObject";
import { AppEntity, makeAppEntity } from "./AppEntity";

export enum AppReleaseStage {
  RELEASE = "RELEASE",
  BETA = "BETA",
  ALPHA = "ALPHA"
}

export abstract class AppRepoEntity extends HostAppObjectEntityRepo<AppEntity> {
  static type = "AppRepoEntity";

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<AppRepoEntity>(AppRepoEntity.type, appObjects);
  }

  abstract createApp: (id: string) => AppEntity;
  abstract getApp: (id: string) => AppEntity | undefined;
  abstract getAllApps: () => AppEntity[];
  abstract deleteApp: (id: string) => void;
  abstract hasApp: (id: string) => boolean;

  abstract appReleaseStage: AppReleaseStage;

  abstract deleteAllApps: () => void;
}

export function makeAppRepo(appObject: HostAppObject): AppRepoEntity {
  return new AppRepoImp(appObject);
}

class AppRepoImp extends AppRepoEntity {
  appReleaseStage: AppReleaseStage = AppReleaseStage.RELEASE;

  createApp = (id: string): AppEntity => {
    const existingApp = this.getForAppObject(id);
    if (existingApp) {
      return existingApp;
    }

    const ao = this.appObjects.getOrCreate(id);

    const app = makeAppEntity(ao);
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

  constructor(appObject: HostAppObject) {
    super(appObject, AppRepoEntity.type);

    this.appObjects.registerSingleton(this);
  }
}
