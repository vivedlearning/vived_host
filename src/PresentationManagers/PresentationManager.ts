import { EntityObserver, ObservableEntity } from "../Entities";


export abstract class PresentionManager {
  abstract doUpdateView: EntityObserver;

  private internalDoUodateView: EntityObserver = () => {
    this.doUpdateView();
  };

  public dispose = () => {
    this.observableEntity.removeObserver(this.internalDoUodateView);
  };

  constructor(private observableEntity: ObservableEntity) {
    observableEntity.addObserver(this.internalDoUodateView);
  }
}
