import { HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity } from "../../AppSandbox";
import { HostStateEntity, HostStateMachine } from "../Entities";


export interface SandboxStateData {
  id: string;
  name: string;
  data: object;
}

export function setSandboxStatesFromData(
  data: SandboxStateData[],
  appObjects: HostAppObjectRepo
) {
  const stateMachine = HostStateMachine.get(appObjects);
  if (!stateMachine) {
    appObjects.submitError(
      "setSandboxStatesFromData",
      "Unable to find StateMachineEntity"
    );
    return;
  }

  const sandbox = AppSandboxEntity.get(appObjects);
  if (!sandbox) {
    appObjects.submitWarning("setSandboxStatesFromData", "Could not find AppSandboxEntity");
    return;
  }

  const states: HostStateEntity[] = [];
  data.forEach((stateData) => {
    const { data, id, name } = stateData;

    const state = stateMachine.stateFactory(id);
    state.setStateData(data);
    state.name = name;
    state.appID = sandbox.appID;
    states.push(state);
  });

  stateMachine.setStates(states);
}
