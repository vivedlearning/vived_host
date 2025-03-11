import { getSingletonComponent, AppObjectRepo, AppObjectUC } from "@vived/core";

export abstract class ConsumeStateUC extends AppObjectUC {
  static type = "ConsumeStateUC";

  abstract consume(id: string): void;

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<ConsumeStateUC>(
      ConsumeStateUC.type,
      appObjects
    );
  }
}
