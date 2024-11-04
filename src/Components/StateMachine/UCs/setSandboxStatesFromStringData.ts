import { HostAppObjectRepo } from "../../../HostAppObject";
import { AppSandboxEntity } from "../../AppSandbox/Entities";
import { HostStateEntity, HostStateMachine } from "../Entities";

export interface SandboxStateStringData {
  id: string;
  name: string;
  data: string;
  assets: string[];
}

export function setSandboxStatesFromStringData(
  datas: SandboxStateStringData[],
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
    state.setStateData(JSON.parse(data));
    state.name = name;
    state.appID = sandbox.appID;
    state.assets = assets;
    states.push(state);
  });

  stateMachine.setStates(states);
}
