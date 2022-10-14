import { EntityObserver, ObservableEntity } from "../Entities";
import { PresentionManager } from "./PresentationManager";

class PresentationManagerImp extends PresentionManager {
  doUpdateView: EntityObserver = () => {};
}

class MockObservableEntity extends ObservableEntity {}

function makeTestRig() {
  const entity = new MockObservableEntity();
  const pm = new PresentationManagerImp(entity);
  const mockUpateView = jest.fn();
  pm.doUpdateView = mockUpateView;

  return { entity, pm, mockUpateView };
}

describe("Presentation Manger Abstract Class", () => {
  it("Updates the view when the entity notifies", () => {
    const { entity, mockUpateView } = makeTestRig();

    entity.notify();
    expect(mockUpateView).toBeCalled();
  });

  it("Can be disposed", () => {
    const { entity, mockUpateView, pm } = makeTestRig();
    pm.dispose();

    entity.notify();
    expect(mockUpateView).not.toBeCalled();
  });
});
