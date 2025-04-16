import {
  AppObject,
  AppObjectPM,
  AppObjectRepo,
  getSingletonComponent
} from "@vived/core";
import { ChallengeResultsEntity } from "../Entities";
import { HostStateMachine } from "../../StateMachine/Entities/HostStateMachine";
import { ChallengeResponse } from "../../StateMachine/Entities/HostStateEntity";

export abstract class HasChallengeResultsPM extends AppObjectPM<boolean> {
  static type = "HasChallengeResultsPM";

  static get(appObjects: AppObjectRepo) {
    return getSingletonComponent<HasChallengeResultsPM>(
      HasChallengeResultsPM.type,
      appObjects
    );
  }
}

export function makeHasChallengeResultsPM(
  appObject: AppObject
): HasChallengeResultsPM {
  return new HasChallengeResultsPMImp(appObject);
}

class HasChallengeResultsPMImp extends HasChallengeResultsPM {
  private get resultsEntity() {
    return this.getCachedSingleton<ChallengeResultsEntity>(
      ChallengeResultsEntity.type
    );
  }

  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  vmsAreEqual(a: boolean, b: boolean): boolean {
    return a === b;
  }

  private onEntityChange = (): void => {
    if (!this.resultsEntity) return;

    let hasAssessmentResults = this.resultsEntity.results?.length > 0 || false;

    // If no results are found, check for expected responses in states
    if (!hasAssessmentResults && this.stateMachine) {
      const stateIds = this.stateMachine.states;

      for (const stateId of stateIds) {
        const state = this.stateMachine.getStateByID(stateId);
        if (
          state &&
          state.expectedResponse !== undefined &&
          state.expectedResponse !== ChallengeResponse.NONE
        ) {
          hasAssessmentResults = true;
          break;
        }
      }
    }

    this.doUpdateView(hasAssessmentResults);
  };

  constructor(appObject: AppObject) {
    super(appObject, HasChallengeResultsPM.type);

    this.appObjects.registerSingleton(this);
    this.resultsEntity?.addChangeObserver(this.onEntityChange);
    this.stateMachine?.addChangeObserver(this.onEntityChange);
    this.onEntityChange();
  }
}
