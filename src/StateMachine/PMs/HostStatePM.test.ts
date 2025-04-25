import { AppObject, AppObjectRepo, makeAppObjectRepo } from "@vived/core";
import { AppEntity, makeAppEntity } from "../../Apps/Entities/AppEntity";
import { AppRepoEntity, makeAppRepo } from "../../Apps/Entities/AppRepo";
import {
  HostStateEntity,
  makeHostStateEntity,
  StreamState
} from "../Entities/HostStateEntity";
import {
  HostStateMachine,
  makeHostStateMachine
} from "../Entities/HostStateMachine";
import { HostStatePM, HostStateVM, makeHostStatePM } from "./HostStatePM";

describe("HostStatePM", () => {
  let appObjects: AppObjectRepo;
  let appObject: AppObject;
  let entity: HostStateEntity;
  let stateMachine: HostStateMachine;
  let appRepo: AppRepoEntity;
  let app: AppEntity;
  let pm: HostStatePM;
  const testId = "test-state-id";
  const testAppId = "test-app-id";
  const testAppName = "Test App Name";

  beforeEach(() => {
    // Set up the test environment
    appObjects = makeAppObjectRepo();

    // Create the state machine first (it's a singleton)
    const stateMachineAppObject = appObjects.getOrCreate("state-machine-id");
    stateMachine = makeHostStateMachine(stateMachineAppObject);

    // Create app repo (it's a singleton)
    const appRepoObject = appObjects.getOrCreate("app-repo-id");
    appRepo = makeAppRepo(appRepoObject);

    // Create a test app
    app = appRepo.createApp(testAppId);
    app.name = testAppName;

    // Create the state entity
    appObject = appObjects.getOrCreate(testId);
    entity = makeHostStateEntity(appObject);
    entity.appID = testAppId;

    // Create the PM on the same AppObject as the entity
    pm = makeHostStatePM(appObject);
  });

  it("should initialize with a view model", () => {
    expect(pm.lastVM).not.toBeUndefined();
    expect(pm.lastVM?.id).toBe(testId);
    expect(pm.lastVM?.isActive).toBe(false);
    expect(pm.lastVM?.appName).toBe(testAppName);
    expect(pm.lastVM?.canBumpBackwards).toBe(false);
    expect(pm.lastVM?.canBumpForward).toBe(false);
    expect(pm.lastVM?.index).toBe(-1);
  });

  it("should update view when entity changes", () => {
    const spy = jest.spyOn(pm, "doUpdateView");

    entity.notifyOnChange();

    expect(spy).toHaveBeenCalled();
  });

  it("should reflect entity properties in view model", () => {
    const testName = "test state";
    const testData = { key: "value" };

    entity.name = testName;
    entity.setStateData(testData);

    expect(pm.lastVM?.id).toBe(testId);
    expect(pm.lastVM?.name).toBe(testName);
    expect(pm.lastVM?.data).toEqual(testData);
    expect(pm.lastVM?.isActive).toBe(false);
    expect(pm.lastVM?.appName).toBe(testAppName);
    expect(pm.lastVM?.canBumpBackwards).toBe(false);
    expect(pm.lastVM?.canBumpForward).toBe(false);
    expect(pm.lastVM?.index).toBe(-1);
  });

  it("should set isActive to true when state is active in state machine", () => {
    // Add the state to the state machine
    stateMachine.setStates([entity]);

    // Set the state as active
    stateMachine.setActiveStateByID(testId);

    // Check that isActive is true in the view model
    expect(pm.lastVM?.isActive).toBe(true);
  });

  it("should update isActive when state machine active state changes", () => {
    // Add the state to the state machine
    stateMachine.setStates([entity]);

    // Initially not active
    expect(pm.lastVM?.isActive).toBe(false);

    // Make it active
    stateMachine.setActiveStateByID(testId);
    expect(pm.lastVM?.isActive).toBe(true);

    // Clear active state
    stateMachine.clearActiveState();
    expect(pm.lastVM?.isActive).toBe(false);
  });

  it("should handle missing app ID", () => {
    // Create a new entity with no app ID
    const newEntity = makeHostStateEntity(
      appObjects.getOrCreate("new-entity-id")
    );
    const newPm = makeHostStatePM(newEntity.appObject);

    // App name should be empty string
    expect(newPm.lastVM?.appName).toBe("");
  });

  it("should handle non-existent app ID", () => {
    // Set app ID to something that doesn't exist
    entity.appID = "non-existent-app";

    // App name should be empty string
    expect(pm.lastVM?.appName).toBe("");
  });

  it("should return true when comparing identical view models in vmsAreEqual", () => {
    const vm1: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(true);
  });

  // Different tests for each property change in vmsAreEqual
  it("should return false when comparing view models with different ids", () => {
    const vm1: HostStateVM = {
      id: "id1",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "id2",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("should return false when comparing view models with different names", () => {
    const vm1: HostStateVM = {
      id: "same",
      name: "name1",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "same",
      name: "name2",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("should return false when comparing view models with different data", () => {
    const vm1: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 456 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("should return false when comparing view models with different isActive", () => {
    const vm1: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: true,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("should return false when comparing view models with different appNames", () => {
    const vm1: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "app1",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "app2",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("should return false when comparing view models with different canBumpBackwards", () => {
    const vm1: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: false,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("should return false when comparing view models with different canBumpForward", () => {
    const vm1: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: false,
      index: 0,
      streamState: StreamState.INIT
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("should return false when comparing view models with different indexes", () => {
    const vm1: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 1,
      streamState: StreamState.INIT
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });

  it("should be available via static getById", () => {
    const retrievedPM = HostStatePM.getById(testId, appObjects);
    expect(retrievedPM).toBe(pm);
  });

  it("should clean up observers on dispose", () => {
    // Spy on removeChangeObserver for entity
    const entitySpy = jest.spyOn(entity, "removeChangeObserver");

    // Spy on removeChangeObserver for state machine
    const stateMachineSpy = jest.spyOn(stateMachine, "removeChangeObserver");

    // Spy on removeChangeObserver for app repo
    const appRepoSpy = jest.spyOn(appRepo, "removeChangeObserver");

    // Dispose the PM
    pm.dispose();

    // Should have called removeChangeObserver on all three
    expect(entitySpy).toHaveBeenCalledWith(expect.any(Function));
    expect(stateMachineSpy).toHaveBeenCalledWith(expect.any(Function));

    // PM should no longer be attached to the AppObject
    expect(appObject.getComponent(HostStatePM.type)).toBeUndefined();
  });

  it("should set canBumpBackwards and canBumpForward correctly based on state position", () => {
    // Create three states
    const state1 = entity; // already created in beforeEach
    const state2 = makeHostStateEntity(appObjects.getOrCreate("state-2"));
    const state3 = makeHostStateEntity(appObjects.getOrCreate("state-3"));

    // Create PMs for each state
    const pm1 = pm; // already created in beforeEach
    const pm2 = makeHostStatePM(state2.appObject);
    const pm3 = makeHostStatePM(state3.appObject);

    // Add states to the state machine
    stateMachine.setStates([state1, state2, state3]);

    // First state should have canBumpBackwards=false, canBumpForward=true
    expect(pm1.lastVM?.canBumpBackwards).toBe(false);
    expect(pm1.lastVM?.canBumpForward).toBe(true);

    // Middle state should have canBumpBackwards=true, canBumpForward=true
    expect(pm2.lastVM?.canBumpBackwards).toBe(true);
    expect(pm2.lastVM?.canBumpForward).toBe(true);

    // Last state should have canBumpBackwards=true, canBumpForward=false
    expect(pm3.lastVM?.canBumpBackwards).toBe(true);
    expect(pm3.lastVM?.canBumpForward).toBe(false);
  });

  it("should update canBumpBackwards and canBumpForward when state position changes", () => {
    // Create two states
    const state1 = entity; // already created in beforeEach
    const state2 = makeHostStateEntity(appObjects.getOrCreate("state-2"));

    // Create PMs for each state
    const pm1 = pm; // already created in beforeEach
    const pm2 = makeHostStatePM(state2.appObject);

    // Initially add just the first state
    stateMachine.setStates([state1]);

    // First and only state should have both properties false
    expect(pm1.lastVM?.canBumpBackwards).toBe(false);
    expect(pm1.lastVM?.canBumpForward).toBe(false);

    // Add the second state
    stateMachine.setStates([state1, state2]);

    // First state should now be able to bump forward
    expect(pm1.lastVM?.canBumpBackwards).toBe(false);
    expect(pm1.lastVM?.canBumpForward).toBe(true);

    // Second state should be able to bump backwards but not forwards
    expect(pm2.lastVM?.canBumpBackwards).toBe(true);
    expect(pm2.lastVM?.canBumpForward).toBe(false);

    // Change order of states
    stateMachine.setStates([state2, state1]);

    // Values should be flipped now
    expect(pm1.lastVM?.canBumpBackwards).toBe(true);
    expect(pm1.lastVM?.canBumpForward).toBe(false);

    expect(pm2.lastVM?.canBumpBackwards).toBe(false);
    expect(pm2.lastVM?.canBumpForward).toBe(true);
  });

  it("should set correct index when state is in state machine", () => {
    // Add the state to the state machine
    stateMachine.setStates([entity]);

    // The index should be 0 (first position)
    expect(pm.lastVM?.index).toBe(0);

    // Add more states before our state
    const state0 = makeHostStateEntity(appObjects.getOrCreate("state-0"));
    stateMachine.setStates([state0, entity]);

    // The index should be 1 (second position)
    expect(pm.lastVM?.index).toBe(1);
  });

  it("should update index when state position changes in state machine", () => {
    // Create two states
    const state1 = entity; // already created in beforeEach
    const state2 = makeHostStateEntity(appObjects.getOrCreate("state-2"));

    // Create PMs for each state
    const pm1 = pm; // already created in beforeEach
    const pm2 = makeHostStatePM(state2.appObject);

    // Add states to the state machine
    stateMachine.setStates([state1, state2]);

    // Check indexes
    expect(pm1.lastVM?.index).toBe(0);
    expect(pm2.lastVM?.index).toBe(1);

    // Change order
    stateMachine.setStates([state2, state1]);

    // Check indexes again
    expect(pm1.lastVM?.index).toBe(1);
    expect(pm2.lastVM?.index).toBe(0);
  });

  it("should initialize with INIT stream state", () => {
    expect(pm.lastVM?.streamState).toBe(StreamState.INIT);
  });

  it("should update view model when streaming state changes", () => {
    const spy = jest.spyOn(pm, "doUpdateView");

    entity.streamState = StreamState.LOADING;

    expect(spy).toHaveBeenCalled();
    expect(pm.lastVM?.streamState).toBe(StreamState.LOADING);
  });

  it("should return false when comparing view models with different streamState", () => {
    const vm1: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.INIT
    };
    const vm2: HostStateVM = {
      id: "same",
      name: "same",
      data: { test: 123 },
      isActive: false,
      appName: "same app",
      canBumpBackwards: true,
      canBumpForward: true,
      index: 0,
      streamState: StreamState.LOADING
    };

    expect(pm.vmsAreEqual(vm1, vm2)).toBe(false);
  });
});
