
import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeAppSandboxEntity, SandboxState } from "../../../AppSandbox/Entities";
import { makeMockStopZSpaceUC, makeZSpaceHostEntity } from "../../../ZSpaceHost";
import { makeHostStateMachine } from "../../Entities";
import { makeMockHostStateEntity } from "../../Mocks";
import { makeEndSandboxActivityUC } from "./EndSandboxActivityUC";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));
  sandbox.state = SandboxState.PLAYING;

  const stateMachine = makeHostStateMachine(
    appObjects.getOrCreate("StateMachine")
  );
  stateMachine.setStates([makeMockHostStateEntity("state1", appObjects)]);
  stateMachine.setActiveStateByID("state1");

  const zSpace = makeZSpaceHostEntity(appObjects.getOrCreate("ZSpace"));
  const mockStop = makeMockStopZSpaceUC(appObjects);

  const endActivityUC = makeEndSandboxActivityUC(appObjects.getOrCreate("UC"));

  return { endActivityUC, sandbox, zSpace, mockStop, stateMachine };
}

describe("End Sandbox Activity UC", () => {
  it("Clears the active state", () => {
    const { stateMachine, endActivityUC } = makeTestRig();
    expect(stateMachine.activeState).toEqual("state1");

    endActivityUC.end();

    expect(stateMachine.activeState).toBeUndefined();
  });

  it("Puts the state back to mounted", () => {
    const { sandbox, endActivityUC } = makeTestRig();
    expect(sandbox.state).toEqual(SandboxState.PLAYING);

    endActivityUC.end();

    expect(sandbox.state).toEqual(SandboxState.MOUNTED);
  });

  it("Stops zSpace if it is running", () => {
    const { endActivityUC, zSpace, mockStop } = makeTestRig();

    zSpace.isActive = true;

    endActivityUC.end();

    expect(mockStop.stopZSpace).toBeCalled();
  });
});
