import {
  getSingletonComponent,
  HostAppObjectRepo,
  HostAppObjectUC
} from "../../../../HostAppObject";

export abstract class ConsumeStateUC extends HostAppObjectUC {
  static type = "ConsumeStateUC";

  abstract consume(id: string): void;

  static get(appObjects: HostAppObjectRepo) {
    return getSingletonComponent<ConsumeStateUC>(
      ConsumeStateUC.type,
      appObjects
    );
  }
}
