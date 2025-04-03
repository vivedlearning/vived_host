import { makeAppObjectRepo } from "@vived/core";

import {
	HasChallengeResultsPM,
	makeHasChallengeResultsPM
} from "./HasChallengeResultsPM";
import { makeChallengeResults } from "../Entities";

function makeTestRig() {
  const appObjects = makeAppObjectRepo();
  const registerSingletonSpy = jest.spyOn(appObjects, "registerSingleton");

  const results = makeChallengeResults(
    appObjects.getOrCreate("ChallengeResults")
  );
  const pm = makeHasChallengeResultsPM(appObjects.getOrCreate("PM"));

  return { appObjects, pm, registerSingletonSpy, results };
}

describe("HasChallengeResultsPM", () => {
  it("Gets the singleton", () => {
    const { pm, appObjects } = makeTestRig();

    expect(HasChallengeResultsPM.get(appObjects)).toEqual(pm);
  });

  it("Registers the singleton", () => {
    const { pm, registerSingletonSpy } = makeTestRig();

    expect(registerSingletonSpy).toBeCalledWith(pm);
  });

  it("Initialize with default VM", () => {
    const { pm } = makeTestRig();

    expect(pm.lastVM).toBe(false);
  });

  it("when results change the VM is updated", () => {
    const { results, pm } = makeTestRig();

    results.submitHitResult("1", false, 0, "bob");

    expect(pm.lastVM).toBe(true);
  });
});
