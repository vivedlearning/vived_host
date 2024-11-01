import { makeHostAppObjectRepo } from "../../../../HostAppObject";
import { makeAppSandboxEntity, SandboxState } from "../../Entities/AppSandboxEntity";
import { makeOnAppIsReadyHandlerAction } from "./onAppIsReadyHandlerAction";

function makeTestRig() {
  const appObjects = makeHostAppObjectRepo();
  const sandbox = makeAppSandboxEntity(appObjects.getOrCreate("Sandbox"));

  const handlerAction = makeOnAppIsReadyHandlerAction(appObjects);

  return { sandbox, handlerAction };
}

describe("On State Change Handler", () => {
  it("Sends the state to the state machine", () => {
    const { sandbox, handlerAction } = makeTestRig();

    expect(sandbox.state).not.toEqual(SandboxState.MOUNTED);

    handlerAction();

    expect(sandbox.state).toEqual(SandboxState.MOUNTED);
  });
});
