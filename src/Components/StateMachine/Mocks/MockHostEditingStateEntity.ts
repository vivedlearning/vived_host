import { HostAppObject, HostAppObjectRepo } from "../../../HostAppObject";
import { HostEditingStateEntity, HostStateEntity } from "../Entities";

export class MockHostEditingStateEntity extends HostEditingStateEntity {
  get isNewState(): boolean {
    throw new Error("Method not implemented.");
  }
  get isEditing(): boolean {
    throw new Error("Method not implemented.");
  }
  get editingState(): HostStateEntity | undefined {
    throw new Error("Method not implemented.");
  }
  get somethingHasChanged(): boolean {
    throw new Error("Method not implemented.");
  }
  stateValidationMessage?: string | undefined;
  startNewState = jest.fn();
  startEditing = jest.fn();
  cancelEditState = jest.fn();
  finishEditing = jest.fn();

  constructor(appObject: HostAppObject) {
    super(appObject, HostEditingStateEntity.type);
  }
}

export function makeMockHostEditingStateEntity(appObjects: HostAppObjectRepo) {
  return new MockHostEditingStateEntity(
    appObjects.getOrCreate("MockHostEditingStateEntity")
  );
}
