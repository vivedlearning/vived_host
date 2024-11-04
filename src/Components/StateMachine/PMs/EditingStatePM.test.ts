import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeMockHostEditingStateEntity } from "../Mocks/MockHostEditingStateEntity";
import { EditingStateVM, makeEditingStatePM } from "./EditingStatePM";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const ao = appObjects.getOrCreate("AO");
  const mockEditEntity = makeMockHostEditingStateEntity(appObjects);

  const isEditingGetter = jest
    .spyOn(mockEditEntity, "isEditing", "get")
    .mockReturnValue(true);

  const isNewGetter = jest
    .spyOn(mockEditEntity, "isNewState", "get")
    .mockReturnValue(true);

  const hasChangesGetter = jest
    .spyOn(mockEditEntity, "somethingHasChanged", "get")
    .mockReturnValue(true);

  const pm = makeEditingStatePM(ao);

  return {
    pm,
    registerSingletonSpy,
    appObjects,
    mockEditEntity,
    isEditingGetter,
    hasChangesGetter,
    isNewGetter
  };
}

describe("Host State Machine Presentation Manager", () => {
  it("Initializes the last vm", () => {
    const { pm } = makeTestRig();
    expect(pm.lastVM).not.toBeUndefined();
  });

  it("Registers as the singleton", () => {
    const { registerSingletonSpy, pm } = makeTestRig();
    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Initializes the VM", () => {
    const { pm } = makeTestRig();

    expect(pm).not.toBeUndefined();
  });

  it("Sets the is editing flag as expected", () => {
    const { pm, mockEditEntity, isEditingGetter } = makeTestRig();

    isEditingGetter.mockReturnValue(true);
    mockEditEntity.notifyOnChange();

    expect(pm.lastVM?.isEditing).toEqual(true);

    isEditingGetter.mockReturnValue(false);
    mockEditEntity.notifyOnChange();

    expect(pm.lastVM?.isEditing).toEqual(false);
  });

  it("Sets the is new state flag as expected", () => {
    const { pm, mockEditEntity, isNewGetter } = makeTestRig();

    isNewGetter.mockReturnValue(true);
    mockEditEntity.notifyOnChange();

    expect(pm.lastVM?.isNewState).toEqual(true);

    isNewGetter.mockReturnValue(false);
    mockEditEntity.notifyOnChange();

    expect(pm.lastVM?.isNewState).toEqual(false);
  });

  it("Sets the has changes flag as expected", () => {
    const { pm, mockEditEntity, hasChangesGetter } = makeTestRig();

    hasChangesGetter.mockReturnValue(true);
    mockEditEntity.notifyOnChange();

    expect(pm.lastVM?.hasChanges).toEqual(true);

    hasChangesGetter.mockReturnValue(false);
    mockEditEntity.notifyOnChange();

    expect(pm.lastVM?.hasChanges).toEqual(false);
  });

  it("Checks for equal vms", () => {
    const { pm } = makeTestRig();

    const vm1: EditingStateVM = {
      hasChanges: false,
      isEditing: false,
      isNewState: false
    };

    const vm2 = { ...vm1 };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(true);
  });

  it("Checks for a change in the has changes flag", () => {
    const { pm } = makeTestRig();

    const vm1: EditingStateVM = {
      hasChanges: false,
      isEditing: false,
      isNewState: false
    };

    const vm2 = { ...vm1, hasChanges: true };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the is editing flag", () => {
    const { pm } = makeTestRig();

    const vm1: EditingStateVM = {
      hasChanges: false,
      isEditing: false,
      isNewState: false
    };

    const vm2 = { ...vm1, isEditing: true };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });

  it("Checks for a change in the is new state flag", () => {
    const { pm } = makeTestRig();

    const vm1: EditingStateVM = {
      hasChanges: false,
      isEditing: false,
      isNewState: false
    };

    const vm2 = { ...vm1, isNewState: true };

    expect(pm.vmsAreEqual(vm1, vm2)).toEqual(false);
  });
});
