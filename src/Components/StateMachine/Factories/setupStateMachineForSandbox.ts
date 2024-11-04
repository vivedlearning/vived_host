import { HostAppObjectRepo } from "../../../HostAppObject";
import {
  HostStateMachine,
  makeHostEditingStateEntity,
  makeHostStateMachine
} from "../Entities";
import { makeEditingStatePM, makeHostStateMachinePM } from "../PMs";
import {
  makeCancelSandboxEditingUC,
  makeConsumeSandboxStateUC,
  makeDeleteStateUC,
  makeDuplicateStateUC,
  makeEditActiveSandboxStateUC,
  makeEditSandboxStateUC,
  makeEndSandboxActivityUC,
  makeNewSandboxStateUC,
  makeSaveAuthoringSandboxUC,
  makeSavePersistentStatesUC,
  makeTransitionToSandboxStateUC
} from "../UCs";

export function setupStateMachineForSandbox(
  appObjects: HostAppObjectRepo
): HostStateMachine {
  const ao = appObjects.getOrCreate("State Machine");

  const entity = makeHostStateMachine(ao);
  makeHostEditingStateEntity(ao);

  // UCs
  makeCancelSandboxEditingUC(ao);
  makeConsumeSandboxStateUC(ao);
  makeEditActiveSandboxStateUC(ao);
  makeEditSandboxStateUC(ao);
  makeEndSandboxActivityUC(ao);
  makeNewSandboxStateUC(ao);
  makeSaveAuthoringSandboxUC(ao);
  makeTransitionToSandboxStateUC(ao);
  makeDeleteStateUC(ao);
  makeDuplicateStateUC(ao);
  makeSavePersistentStatesUC(ao);

  // PMs
  makeEditingStatePM(ao);
  makeHostStateMachinePM(ao);

  return entity;
}
