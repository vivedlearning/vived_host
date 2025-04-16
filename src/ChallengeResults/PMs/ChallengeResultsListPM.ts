import { AppObject, AppObjectPM, AppObjectRepo } from "@vived/core";
import { HostStateMachine } from "../../StateMachine/Entities/HostStateMachine";
import {
  ChallengeResultHitData,
  ChallengeResultMultiHitData,
  ChallengeResultProgressData,
  ChallengeResultQualityData,
  ChallengeResultScoreData,
  ChallengeResultsEntity,
  ChallengeResultType
} from "../Entities/ChallengeResults";
import { ChallengeResponse } from "../../StateMachine";

export interface ChallengeResultVM {
  id: string;
  slideName: string;
  attempts: number;
  message: string;
  resultType?: ChallengeResultType;
  stateIndex: number;
  resultData?:
    | ChallengeResultHitData
    | ChallengeResultMultiHitData
    | ChallengeResultQualityData
    | ChallengeResultScoreData
    | ChallengeResultProgressData;
}

export abstract class ChallengeResultsListPM extends AppObjectPM<
  ChallengeResultVM[]
> {
  static type = "ChallengeResultsListPM";

  static get(appObjects: AppObjectRepo) {
    return appObjects.getSingleton<ChallengeResultsListPM>(
      ChallengeResultsListPM.type
    );
  }
}

export function makeChallengeResultsPM(
  appObject: AppObject
): ChallengeResultsListPM {
  return new ChallengeResultsPMImp(appObject);
}

class ChallengeResultsPMImp extends ChallengeResultsListPM {
  private get results() {
    return this.getCachedSingleton<ChallengeResultsEntity>(
      ChallengeResultsEntity.type
    );
  }

  private get stateMachine() {
    return this.getCachedSingleton<HostStateMachine>(HostStateMachine.type);
  }

  vmsAreEqual(a: ChallengeResultVM[], b: ChallengeResultVM[]): boolean {
    if (a.length !== b.length) return false;

    let areEqual = true;
    a.forEach((aResult, i) => {
      const bResult = b[i];
      if (aResult.id !== bResult.id) areEqual = false;
      else if (aResult.attempts !== bResult.attempts) areEqual = false;
    });
    return areEqual;
  }

  onEntityChange = (): void => {
    if (!this.results || !this.stateMachine) return;

    const organizedResults: ChallengeResultVM[] = [];

    // Get all states from state machine
    const stateIds = this.stateMachine.states;

    // Process each state
    stateIds.forEach((stateId) => {
      const state = this.stateMachine!.getStateByID(stateId);
      if (!state) return;

      const stateIndex = this.stateMachine!.getStateIndex(stateId) ?? -1;
      const result = this.results!.getResultForSlide(stateId);

      // If state has a result, add it with all result data
      if (result) {
        const vm: ChallengeResultVM = {
          id: stateId,
          slideName: state.name,
          attempts: result.tries,
          resultType: result.type,
          message: result.message,
          stateIndex,
          resultData: result.resultData
        };

        organizedResults.push(vm);
      }
      // If state has no result but has expected response that's not NONE, add it with partial data
      else if (
        state.expectedResponse !== undefined &&
        state.expectedResponse !== ChallengeResponse.NONE
      ) {
        const vm: ChallengeResultVM = {
          id: stateId,
          slideName: state.name,
          attempts: 0,
          stateIndex,
          message: "Incomplete"
        };

        organizedResults.push(vm);
      }
    });

    this.doUpdateView(organizedResults);
  };

  constructor(appObject: AppObject) {
    super(appObject, ChallengeResultsListPM.type);
    this.doUpdateView([]);
    this.results?.addChangeObserver(this.onEntityChange);
    this.stateMachine?.addChangeObserver(this.onEntityChange);

    // Initial update
    this.onEntityChange();

    this.appObjects.registerSingleton(this);
  }
}
