import { ObservableEntity } from "./ObservableEntity";

class ObservableEntityImp extends ObservableEntity {}

function makeTestRig() {
  const observerableEnitity = new ObservableEntityImp();
  const observer = jest.fn();
  observerableEnitity.addObserver(observer);

  return { observerableEnitity, observer };
}

describe("Abstract Observable Entity", () => {
  it("Notifies", () => {
    const { observer, observerableEnitity } = makeTestRig();
    observerableEnitity.notify();

    expect(observer).toBeCalled();
  });

  it("Removes an observer", () => {
    const { observer, observerableEnitity } = makeTestRig();
    observerableEnitity.removeObserver(observer);
    observerableEnitity.notify();

    expect(observer).not.toBeCalled();
  });
});
