import { makeHostAppObjectRepo } from "../../../HostAppObject";
import { makeAppSandboxEntity } from "../../AppSandbox/Entities";
import { makeHostStateMachine } from "../Entities";
import {
  SandboxStateData,
  setSandboxStatesFromData
} from "./setSandboxStatesFromData";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("State Machine")
  );

  makeAppSandboxEntity(appObjects.getOrCreate("AnAppID"));

  return { stateMachine, appObjects };
}

describe("Set sandbox states from data", () => {
  it("Makes the states", () => {
    const { stateMachine, appObjects } = makeTestRig();

    expect(stateMachine.states.length).toEqual(0);

    const states: SandboxStateData[] = [
      {
        data: { state: "one" },
        id: "state1",
        name: "state one"
      },
      {
        data: { state: "two" },
        id: "state2",
        name: "state two"
      }
    ];

    setSandboxStatesFromData(states, appObjects);

    expect(stateMachine.states.length).toEqual(2);
  });

  it("Sets up the states", () => {
    const { stateMachine, appObjects } = makeTestRig();

    const states: SandboxStateData[] = [
      {
        data: { state: "one" },
        id: "state1",
        name: "state one"
      }
    ];

    setSandboxStatesFromData(states, appObjects);

    const state = stateMachine.getStateByID("state1");
    expect(state?.name).toEqual("state one");
    expect(state?.stateData).toEqual({ state: "one" });
  });

  it("Sets the App ID", () => {
    const { stateMachine, appObjects } = makeTestRig();

    const states: SandboxStateData[] = [
      {
        data: { state: "one" },
        id: "state1",
        name: "state one"
      }
    ];

    setSandboxStatesFromData(states, appObjects);

    const state = stateMachine.getStateByID("state1");
    expect(state?.appID).toEqual("AnAppID");
  });
});
