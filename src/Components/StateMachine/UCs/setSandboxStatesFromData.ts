import { AppObjectRepo } from "@vived/core";
import { AppSandboxEntity } from "../../AppSandbox/Entities";
import { HostStateEntity, HostStateMachine } from "../Entities";

export interface SandboxStateData {
  id: string;
  name: string;
  data: object;
  assets: string[];
}

export function setSandboxStatesFromData(
  datas: SandboxStateData[],
  appObjects: AppObjectRepo
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
    appObjects.submitWarning(
      "setSandboxStatesFromData",
      "Could not find AppSandboxEntity"
    );
    return;
  }

  const states: HostStateEntity[] = [];
  datas.forEach((stateData) => {
    const { data, id, name, assets } = stateData;

    const state = stateMachine.stateFactory(id);
    state.setStateData(data);
    state.name = name;
    state.appID = sandbox.appID;
    state.assets = assets;
    states.push(state);
  });

  stateMachine.setStates(states);
}
